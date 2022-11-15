import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const verifyUsername = await this.findByUserName(createUserDto.username);

    const createdUser = verifyUsername
      ? new UnauthorizedException('username already exists')
      : await this.prisma.user.create({
          data: data,
          include: {
            account: {
              select: {
                id: true,
                balance: true,
              },
            },
          },
        });

    console.log(createdUser);

    return {
      ...createdUser,
      password: undefined,
    };
  }

  findAll() {
    const data = this.prisma.user.findMany().then((data) =>
      data.map((d) => ({
        ...d,
        password: undefined,
      })),
    );
    return data;
  }

  findOne(id: number) {
    return this.prisma.user
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((data) => ({ ...data, password: undefined }));
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto.password
      ? new UnauthorizedException('password is not editable')
      : this.prisma.user
          .update({
            where: {
              id: id,
            },
            data: updateUserDto,
          })
          .then((data) => ({ ...data, password: undefined }));
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id: id } });
  }

  findByUserName(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }
}
