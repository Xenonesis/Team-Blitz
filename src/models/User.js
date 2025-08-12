import { isMockMode, mockCollection } from '@/utils/mockFirebase';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'users';

// Get the appropriate database connection
const getDb = async () => {
  if (isMockMode()) {
    return mockCollection(COLLECTION_NAME);
  } else {
    const { adminDb } = await import('@/utils/firebaseAdmin');
    return adminDb.collection(COLLECTION_NAME);
  }
};

class User {
  constructor(data) {
    this.username = data.username;
    this.email = data.email?.toLowerCase();
    this.password = data.password;
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.id = data.id;
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.username || this.username.length < 3 || this.username.length > 30) {
      errors.push('Username must be between 3 and 30 characters');
    }
    
    if (!this.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
      errors.push('Please enter a valid email');
    }
    
    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (!['admin', 'user'].includes(this.role)) {
      errors.push('Role must be either admin or user');
    }
    
    return errors;
  }

  // Hash password
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Save user to Firestore
  async save() {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    // Check for existing user with same email or username
    const existingUser = await User.findOne({
      $or: [
        { email: this.email },
        { username: this.username }
      ]
    });

    if (existingUser && existingUser.id !== this.id) {
      throw new Error('User with this email or username already exists');
    }

    await this.hashPassword();
    this.updatedAt = new Date();

    const userData = this.toFirestore();
    
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.save(userData);
      this.id = result.id;
    } else {
      const { adminDb } = await import('@/utils/firebaseAdmin');
      if (this.id) {
        await adminDb.collection(COLLECTION_NAME).doc(this.id).set(userData);
      } else {
        const docRef = await adminDb.collection(COLLECTION_NAME).add(userData);
        this.id = docRef.id;
      }
    }
    
    return this;
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Convert to JSON (without password)
  toJSON() {
    const { password, ...userWithoutPassword } = this.toFirestore();
    return {
      id: this.id,
      ...userWithoutPassword
    };
  }

  // Static methods
  static async findOne(query) {
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.findOne(query);
      return result ? new User(result) : null;
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    if (query.$or) {
      // Handle $or queries by checking each condition
      for (const condition of query.$or) {
        const field = Object.keys(condition)[0];
        const value = condition[field];
        const snapshot = await collection.where(field, '==', value).limit(1).get();
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const userData = { id: doc.id, ...doc.data() };
          return new User(userData);
        }
      }
      return null;
    } else {
      // Handle regular queries
      for (const [field, value] of Object.entries(query)) {
        firestoreQuery = firestoreQuery.where(field, '==', value);
      }
      
      const snapshot = await firestoreQuery.limit(1).get();
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      const userData = { id: doc.id, ...doc.data() };
      return new User(userData);
    }
  }

  static async find(query = {}) {
    if (isMockMode()) {
      const db = await getDb();
      const results = await db.find(query);
      return results.map(data => new User(data));
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const collection = adminDb.collection(COLLECTION_NAME);
    let firestoreQuery = collection;

    for (const [field, value] of Object.entries(query)) {
      firestoreQuery = firestoreQuery.where(field, '==', value);
    }

    const snapshot = await firestoreQuery.get();
    return snapshot.docs.map(doc => {
      const userData = { id: doc.id, ...doc.data() };
      return new User(userData);
    });
  }

  static async findById(id) {
    if (isMockMode()) {
      const db = await getDb();
      const result = await db.findById(id);
      return result ? new User(result) : null;
    }

    const { adminDb } = await import('@/utils/firebaseAdmin');
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    
    const userData = { id: doc.id, ...doc.data() };
    return new User(userData);
  }
}

export default User;
