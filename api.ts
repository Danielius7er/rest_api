// server.ts
import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface CreateUserDTO {
  name: string;
  email: string;
}

class ValidationError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

class UserRepository {
  private users: Map<number, User> = new Map();
  private nextId: number = 1;

  create(data: CreateUserDTO): User {
    this.validateEmail(data.email);
    
    const user: User = {
      id: this.nextId++,
      ...data,
      createdAt: new Date()
    };
    
    this.users.set(user.id, user);
    return user;
  }

  findById(id: number): User | undefined {
    return this.users.get(id);
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  update(id: number, data: Partial<CreateUserDTO>): User {
    const user = this.findById(id);
    if (!user) {
      throw new ValidationError(404, 'User not found');
    }

    if (data.email) {
      this.validateEmail(data.email);
      user.email = data.email;
    }

    if (data.name) {
      user.name = data.name;
    }

    this.users.set(id, user);
    return user;
  }

  delete(id: number): boolean {
    return this.users.delete(id);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError(400, 'Invalid email format');
    }
  }
}

class UserService {
  constructor(private userRepository: UserRepository) {}

  createUser(data: CreateUserDTO): User {
    this.validateUserData(data);
    return this.userRepository.create(data);
  }

  getUser(id: number): User {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new ValidationError(404, 'User not found');
    }
    return user;
  }

  getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  updateUser(id: number, data: Partial<CreateUserDTO>): User {
    this.validatePartialUserData(data);
    return this.userRepository.update(id, data);
  }

  deleteUser(id: number): void {
    if (!this.userRepository.delete(id)) {
      throw new ValidationError(404, 'User not found');
    }
  }

  private validateUserData(data: CreateUserDTO): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError(400, 'Name is required');
    }
    if (!data.email || data.email.trim().length === 0) {
      throw new ValidationError(400, 'Email is required');
    }
  }

  private validatePartialUserData(data: Partial<CreateUserDTO>): void {
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError(400, 'Name is required');
    }
    if (data.email !== undefined && data.email.trim().length === 0) {
      throw new ValidationError(400, 'Email is required');
    }
  }
}

export function createApp(): Express {
  const app = express();
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  app.use(express.json());

  // Middleware de tratamento de erros
  const asyncHandler = (fn: RequestHandler): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // Rotas
  app.post('/api/users', asyncHandler(async (req: Request, res: Response) => {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
  }));

  app.get('/api/users/:id', asyncHandler(async (req: Request, res: Response) => {
    const user = userService.getUser(parseInt(req.params.id));
    res.json(user);
  }));

  app.get('/api/users', asyncHandler(async (req: Request, res: Response) => {
    const users = userService.getAllUsers();
    res.json(users);
  }));

  app.put('/api/users/:id', asyncHandler(async (req: Request, res: Response) => {
    const user = userService.updateUser(parseInt(req.params.id), req.body);
    res.json(user);
  }));

  app.delete('/api/users/:id', asyncHandler(async (req: Request, res: Response) => {
    userService.deleteUser(parseInt(req.params.id));
    res.status(204).send();
  }));

  app.get('/', (req, res) => {
    res.send('API funcionando');
  });

  // Middleware de tratamento de erro global
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}

if (require.main === module) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
