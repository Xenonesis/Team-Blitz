import { adminDb } from '@/utils/firebaseAdmin';

const COLLECTION_NAME = 'hackathonStages';

class HackathonStage {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.order = data.order;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name) {
      errors.push('Name is required');
    }
    
    if (!this.description) {
      errors.push('Description is required');
    }
    
    if (this.order === undefined || this.order === null) {
      errors.push('Order is required');
    }
    
    return errors;
  }

  // Save hackathon stage to Firestore
  async save() {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    this.updatedAt = new Date();
    const stageData = this.toFirestore();
    
    if (this.id) {
      await adminDb.collection(COLLECTION_NAME).doc(this.id).set(stageData);
    } else {
      const docRef = await adminDb.collection(COLLECTION_NAME).add(stageData);
      this.id = docRef.id;
    }
    
    return this;
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      name: this.name,
      description: this.description,
      order: this.order,
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
      const stageData = { id: doc.id, ...doc.data() };
      return new HackathonStage(stageData);
    });
  }

  static async findOne(query) {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  static async findById(id) {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    
    const stageData = { id: doc.id, ...doc.data() };
    return new HackathonStage(stageData);
  }

  static async deleteMany(query) {
    const stages = await this.find(query);
    const batch = adminDb.batch();
    
    stages.forEach(stage => {
      const docRef = adminDb.collection(COLLECTION_NAME).doc(stage.id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    return { deletedCount: stages.length };
  }
}

export default HackathonStage;