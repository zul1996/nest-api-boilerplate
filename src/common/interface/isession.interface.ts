export interface ISessionService {
  store(sessionId: string, userId: string, ttlSeconds: number): Promise<void>;
  validate(sessionId: string, userId: string): Promise<void>;
  remove(sessionId: string): Promise<void>;
}
