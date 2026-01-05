import { query } from './db';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, fullName: string) {
  const hashedPassword = await hashPassword(password);
  
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, full_name, created_at`,
    [email, hashedPassword, fullName]
  );
  
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await query(
    `SELECT id, email, password_hash, full_name, created_at 
     FROM users WHERE email = $1`,
    [email]
  );
  
  return result.rows[0] || null;
}

export async function findUserById(id: string) {
  const result = await query(
    `SELECT id, email, full_name, created_at 
     FROM users WHERE id = $1`,
    [id]
  );
  
  return result.rows[0] || null;
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isValid = await verifyPassword(password, user.password_hash);
  
  if (!isValid) {
    return null;
  }
  
  // Return user without password hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
