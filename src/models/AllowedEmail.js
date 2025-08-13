import { isMockMode, mockCollection } from '@/utils/mockFirebase';

const COLLECTION_NAME = 'allowed_emails';

// Get the appropriate database connection
const getDb = async () => {
  if (isMockMode()) {
    return mockCollection(COLLECTION_NAME);
  } else {
    const { adminDb } = await import('@/utils/firebaseAdmin');
    return adminDb.collection(COLLECTION_NAME);
  }
};

class AllowedEmail {
  constructor(data) {
    this.email = data.email?.toLowerCase();
    this.status = data.status || 'allowed'; // 'allowed' or 'blocked'
    this.addedBy = data.addedBy;
    this.addedAt = data.addedAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.id = data.id;
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
      errors.push('Please enter a valid email');
    }
    
    if (!['allowed', 'blocked'].includes(this.status)) {
      errors.push('Status must be allowed or blocked');
    }
    
    return errors;
  }

  // Save to database
  async save() {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    this.updatedAt = new Date();
    const emailData = this.toFirestore();
    
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.save(emailData);
      this.id = result.id;
    } else {
      const { adminDb } = await import('@/utils/firebaseAdmin');
      if (this.id) {
        await adminDb.collection(COLLECTION_NAME).doc(this.id).set(emailData);
      } else {
        const docRef = await adminDb.collection(COLLECTION_NAME).add(emailData);
        this.id = docRef.id;
      }
    }
    
    return this;
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      email: this.email,
      status: this.status,
      addedBy: this.addedBy,
      addedAt: this.addedAt,
      updatedAt: this.updatedAt
    };
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      ...this.toFirestore()
    };
  }

  // Static methods
  static async findOne(query) {
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.findOne(query);
      return result ? new AllowedEmail(result) : null;
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    for (const [field, value] of Object.entries(query)) {
      firestoreQuery = firestoreQuery.where(field, '==', value);
    }
    
    const snapshot = await firestoreQuery.limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const emailData = { id: doc.id, ...doc.data() };
    return new AllowedEmail(emailData);
  }

  static async find(query = {}) {
    if (isMockMode()) {
      const db = await getDb();
      const results = await db.find(query);
      return results.map(data => new AllowedEmail(data));
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    for (const [field, value] of Object.entries(query)) {
      firestoreQuery = firestoreQuery.where(field, '==', value);
    }

    const snapshot = await firestoreQuery.get();
    return snapshot.docs.map(doc => {
      const emailData = { id: doc.id, ...doc.data() };
      return new AllowedEmail(emailData);
    });
  }

  static async findById(id) {
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.findById(id);
      return result ? new AllowedEmail(result) : null;
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    
    const emailData = { id: doc.id, ...doc.data() };
    return new AllowedEmail(emailData);
  }

  static async deleteOne(query) {
    if (isMockMode()) {
      const db = await getDb();
      return await db.deleteOne(query);
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    for (const [field, value] of Object.entries(query)) {
      firestoreQuery = firestoreQuery.where(field, '==', value);
    }

    const snapshot = await firestoreQuery.limit(1).get();
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
      return true;
    }
    return false;
  }

  // Helper methods for email management
  static async getAllowedEmails() {
    const emails = await this.find({ status: 'allowed' });
    return emails.map(email => email.email);
  }

  static async getBlockedEmails() {
    const emails = await this.find({ status: 'blocked' });
    return emails.map(email => email.email);
  }

  static async isEmailAllowed(email) {
    if (!email) return false;
    
    const normalizedEmail = email.toLowerCase();
    const emailRecord = await this.findOne({ email: normalizedEmail });
    
    return emailRecord && emailRecord.status === 'allowed';
  }

  static async addEmail(email, addedBy) {
    const normalizedEmail = email.toLowerCase();
    
    // Check if email already exists
    const existing = await this.findOne({ email: normalizedEmail });
    if (existing) {
      if (existing.status === 'allowed') {
        throw new Error('Email already in allowed list');
      } else {
        // Update blocked email to allowed
        existing.status = 'allowed';
        existing.addedBy = addedBy;
        existing.updatedAt = new Date();
        return await existing.save();
      }
    }
    
    // Create new allowed email
    const allowedEmail = new AllowedEmail({
      email: normalizedEmail,
      status: 'allowed',
      addedBy
    });
    
    return await allowedEmail.save();
  }

  static async blockEmail(email, addedBy) {
    const normalizedEmail = email.toLowerCase();
    
    const existing = await this.findOne({ email: normalizedEmail });
    if (existing) {
      existing.status = 'blocked';
      existing.addedBy = addedBy;
      existing.updatedAt = new Date();
      return await existing.save();
    }
    
    // Create new blocked email
    const blockedEmail = new AllowedEmail({
      email: normalizedEmail,
      status: 'blocked',
      addedBy
    });
    
    return await blockedEmail.save();
  }

  static async removeEmail(email) {
    const normalizedEmail = email.toLowerCase();
    return await this.deleteOne({ email: normalizedEmail });
  }
}

export default AllowedEmail;