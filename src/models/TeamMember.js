import { adminDb } from '@/utils/firebaseAdmin';

const COLLECTION_NAME = 'teamMembers';

class TeamMember {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
    this.email = data.email;
    this.skills = data.skills || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name) {
      errors.push('Name is required');
    }
    
    if (!this.role) {
      errors.push('Role is required');
    }
    
    if (!this.email) {
      errors.push('Email is required');
    }
    
    return errors;
  }

  // Save team member to Firestore
  async save() {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    // Check for existing team member with same email
    const existingMember = await TeamMember.findOne({ email: this.email });
    if (existingMember && existingMember.id !== this.id) {
      throw new Error('Team member with this email already exists');
    }

    this.updatedAt = new Date();
    const memberData = this.toFirestore();
    
    if (this.id) {
      await adminDb.collection(COLLECTION_NAME).doc(this.id).set(memberData);
    } else {
      const docRef = await adminDb.collection(COLLECTION_NAME).add(memberData);
      this.id = docRef.id;
    }
    
    return this;
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      name: this.name,
      role: this.role,
      email: this.email,
      skills: this.skills,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static methods
  static async find(query = {}) {
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    for (const [field, value] of Object.entries(query)) {
      firestoreQuery = firestoreQuery.where(field, '==', value);
    }

    const snapshot = await firestoreQuery.get();
    return snapshot.docs.map(doc => {
      const memberData = { id: doc.id, ...doc.data() };
      return new TeamMember(memberData);
    });
  }

  static async findOne(query) {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  static async findById(id) {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    
    const memberData = { id: doc.id, ...doc.data() };
    return new TeamMember(memberData);
  }

  static async deleteMany(query) {
    const members = await this.find(query);
    const batch = adminDb.batch();
    
    members.forEach(member => {
      const docRef = adminDb.collection(COLLECTION_NAME).doc(member.id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    return { deletedCount: members.length };
  }
}

export default TeamMember;