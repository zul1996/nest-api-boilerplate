import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto, updateUserDto } from './dto/create-user.dto';
import { Users as UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    createdBy?: string,
  ): Promise<UserEntity> {
    // Periksa apakah username sudah ada
    const existingUser = await this.findUserByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    //^^ bisa begini
    // const newUser = new UserEntity();
    // newUser.username = createUserDto.username,
    //   newUser.password= hashedPassword,
    //   newUser.fullName= createUserDto.fullName,
    //   newUser.email= createUserDto.email,
    //   newUser.phoneNumber= createUserDto.phoneNumber,
    //   newUser.roleUser = createUserDto.role,

    //^^ saya suka pake model repo begini
    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      roleUser: createUserDto.role, // Set default createdBy if not provided
      createdBy: createdBy || 'system',
      isActive: true, // Set default isActive to true
      enabled: true, // Set default enabled to true
      accountExpired: false, // Set default accountExpired to false

    });

    // Simpan pengguna di database
    return this.userRepository.save(user);
  }


  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'], // Pilih hanya kolom yang diperlukan
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }


  async validateUser(username: string, password: string): Promise<UserEntity> {
    // Cari pengguna berdasarkan username
    const user = await this.findByUsername(username);

    // Periksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  async update(
    username: string,
    updateUserDto: updateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findByUsername(username);

    if (updateUserDto.password) {
      // Jika password diupdate, hash password baru
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update data pengguna
    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return updatedUser;
  }

  // Method to register user and generate JWT tokens
  async registerUser(createUserDto: CreateUserDto, createdBy?: string) {
    const newUser = await this.create(createUserDto, createdBy);

    console.log('===> User entity to be saved:', newUser);

    // Generate access and refresh tokens
    const payload = { sub: newUser.id, username: newUser.username };

    console.log('===> JWT payload:', payload);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken, user: newUser };
  }
}
