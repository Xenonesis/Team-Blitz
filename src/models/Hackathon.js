import { isMockMode, mockCollection } from '@/utils/mockFirebase';

const COLLECTION_NAME = 'hackathons';

// Get the appropriate database connection
const getDb = async () => {
  if (isMockMode()) {
    return mockCollection(COLLECTION_NAME);
  } else {
    const { adminDb } = await import('@/utils/firebaseAdmin');
    return adminDb.collection(COLLECTION_NAME);
  }
};

class Hackathon {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.leader = data.leader;
    this.currentStage = data.currentStage || 'ppt';
    this.progress = data.progress || { completedTasks: 0, totalTasks: 0 };
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.description = data.description;
    this.participants = data.participants || [];
    this.status = data.status || 'upcoming';
    this.location = data.location;
    this.website = data.website || '';
    this.prize = data.prize || '';
    this.technologies = data.technologies || '';
    this.totalTasks = data.totalTasks || 0;
    this.roundDates = data.roundDates || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this._id = data._id || data.id;
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name) {
      errors.push('Name is required');
    }
    
    if (!this.leader) {
      errors.push('Leader is required');
    }
    
    if (!this.startDate) {
      errors.push('Start date is required');
    }
    
    if (!this.endDate) {
      errors.push('End date is required');
    }
    
    if (!this.description) {
      errors.push('Description is required');
    }
    
    if (!this.location) {
      errors.push('Location is required');
    }
    
    if (!['active', 'completed', 'upcoming'].includes(this.status)) {
      errors.push('Status must be active, completed, or upcoming');
    }
    
    return errors;
  }

  // Save hackathon to Firestore
  async save() {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    this.updatedAt = new Date();
    const hackathonData = this.toFirestore();
    
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.save(hackathonData);
      this.id = result.id;
      this._id = result.id;
    } else {
      const { adminDb } = await import('@/utils/firebaseAdmin');
      if (this.id) {
        await adminDb.collection(COLLECTION_NAME).doc(this.id).set(hackathonData);
      } else {
        const docRef = await adminDb.collection(COLLECTION_NAME).add(hackathonData);
        this.id = docRef.id;
        this._id = docRef.id;
      }
    }
    
    return this;
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      leader: this.leader,
      currentStage: this.currentStage,
      progress: this.progress,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      participants: this.participants,
      status: this.status,
      location: this.location,
      website: this.website,
      prize: this.prize,
      technologies: this.technologies,
      totalTasks: this.totalTasks,
      roundDates: this.roundDates,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static methods
  static async find(query = {}) {
    if (isMockMode()) {
      const db = await getDb();
      const results = await db.find(query);
      return results.map(data => new Hackathon(data));
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    // Handle special MongoDB-style queries
    for (const [field, value] of Object.entries(query)) {
      if (field === 'status' && value.$in) {
        // Handle $in operator for status
        const results = [];
        for (const statusValue of value.$in) {
          const snapshot = await collection.where('status', '==', statusValue).get();
          snapshot.docs.forEach(doc => {
            const hackathonData = { id: doc.id, ...doc.data() };
            results.push(new Hackathon(hackathonData));
          });
        }
        return results;
      } else if (typeof value === 'object' && value.$in) {
        // Handle other $in operators
        const results = [];
        for (const inValue of value.$in) {
          const snapshot = await collection.where(field, '==', inValue).get();
          snapshot.docs.forEach(doc => {
            const hackathonData = { id: doc.id, ...doc.data() };
            results.push(new Hackathon(hackathonData));
          });
        }
        return results;
      } else {
        firestoreQuery = firestoreQuery.where(field, '==', value);
      }
    }

    const snapshot = await firestoreQuery.get();
    return snapshot.docs.map(doc => {
      const hackathonData = { id: doc.id, ...doc.data() };
      return new Hackathon(hackathonData);
    });
  }

  static async findOne(query) {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  static async findById(id) {
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.findById(id);
      return result ? new Hackathon(result) : null;
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    
    const hackathonData = { id: doc.id, ...doc.data() };
    return new Hackathon(hackathonData);
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    if (isMockMode()) {
      const db = await getDb();
      const current = await db.findById(id);
      if (!current) return null;
      
      const updatedData = { ...current, ...updateData, updatedAt: new Date() };
      await db.save(updatedData);
      
      return new Hackathon(options.new ? updatedData : current);
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    
    const currentData = { id: doc.id, ...doc.data() };
    const updatedData = { ...currentData, ...updateData, updatedAt: new Date() };
    
    await adminDb.collection(COLLECTION_NAME).doc(id).set(updatedData);
    
    if (options.new) {
      return new Hackathon(updatedData);
    }
    
    return new Hackathon(currentData);
  }

  static async deleteMany(query) {
    if (isMockMode()) {
      const db = await getDb();
      return await db.deleteMany(query);
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const hackathons = await this.find(query);
    const batch = adminDb.batch();
    
    hackathons.forEach(hackathon => {
      const docRef = adminDb.collection(COLLECTION_NAME).doc(hackathon.id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    return { deletedCount: hackathons.length };
  }
}

export default Hackathon;