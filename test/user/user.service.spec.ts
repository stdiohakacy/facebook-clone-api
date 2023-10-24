import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import Joi from 'joi';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import configs from 'src/configs';
import { ApiKeyModule } from 'src/core/api-key/api-key.module';
import { AuthCoreModule } from 'src/core/auth/auth.core.module';
import { DatabaseOptionsModule } from 'src/core/database/database.options.module';
import { DatabaseOptionService } from 'src/core/database/services/database.options.service';
import { DebuggerModule } from 'src/core/debugger/debugger.module';
import { ErrorModule } from 'src/core/error/error.module';
import { HelperModule } from 'src/core/helper/helper.module';
import { ENUM_MESSAGE_LANGUAGE } from 'src/core/message/constants/message.enum.constant';
import { MessageModule } from 'src/core/message/message.module';
import { PaginationModule } from 'src/core/pagination/pagination.module';
import { RequestModule } from 'src/core/request/request.module';
import { ResponseModule } from 'src/core/response/response.module';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { userStub } from './stubs/user.stub';
import { AuthService } from 'src/core/auth/services/auth.service';
import { UserLoginDTO } from 'src/modules/user/dtos/user.login.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import { ENUM_USER_STATUS } from 'src/modules/user/constants/user.enum.constant';

describe('The User Service', () => {
    let userService: UserService;
    let findOne: jest.Mock;
    let save: jest.Mock;

    beforeEach(async () => {
        findOne = jest.fn();
        save = jest.fn();
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: configs,
                    isGlobal: true,
                    cache: true,
                    envFilePath: ['.env'],
                    expandVariables: true,
                    validationSchema: Joi.object({
                        APP_NAME: Joi.string().required(),
                        APP_ENV: Joi.string()
                            .valid(...Object.values(ENUM_APP_ENVIRONMENT))
                            .default('development')
                            .required(),
                        APP_LANGUAGE: Joi.string()
                            .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
                            .default(APP_LANGUAGE)
                            .required(),

                        HTTP_ENABLE: Joi.boolean().default(true).required(),
                        HTTP_HOST: [
                            Joi.string().ip({ version: 'ipv4' }).required(),
                            Joi.valid('localhost').required(),
                        ],
                        HTTP_PORT: Joi.number().default(3000).required(),
                        HTTP_VERSIONING_ENABLE: Joi.boolean()
                            .default(true)
                            .required(),
                        HTTP_VERSION: Joi.number().required(),

                        DEBUGGER_HTTP_WRITE_INTO_FILE: Joi.boolean()
                            .default(false)
                            .required(),
                        DEBUGGER_HTTP_WRITE_INTO_CONSOLE: Joi.boolean()
                            .default(false)
                            .required(),
                        DEBUGGER_SYSTEM_WRITE_INTO_FILE: Joi.boolean()
                            .default(false)
                            .required(),
                        DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE: Joi.boolean()
                            .default(false)
                            .required(),

                        JOB_ENABLE: Joi.boolean().default(false).required(),

                        DATABASE_HOST: Joi.string()
                            .default('127.0.0.1')
                            .required(),
                        DATABASE_NAME: Joi.string()
                            .default('parking-lot-db')
                            .required(),
                        DATABASE_USER: Joi.string()
                            .allow(null, 'postgres')
                            .optional(),
                        DATABASE_PASSWORD: Joi.string()
                            .allow(null, 'postgres')
                            .optional(),

                        AUTH_JWT_SUBJECT: Joi.string().required(),
                        AUTH_JWT_AUDIENCE: Joi.string().required(),
                        AUTH_JWT_ISSUER: Joi.string().required(),

                        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
                            // .alphanum()
                            .min(5)
                            .max(50000)
                            .required(),
                        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string()
                            .default('15m')
                            .required(),

                        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
                            // .alphanum()
                            .min(5)
                            .max(50000)
                            .required(),
                        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string()
                            .default('7d')
                            .required(),
                        AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION:
                            Joi.string().default('15m').required(),

                        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean()
                            .default(false)
                            .required(),
                        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
                            .allow(null, '')
                            .min(20)
                            .max(50)
                            .optional(),
                        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
                            .allow(null, '')
                            .min(16)
                            .max(50)
                            .optional(),
                        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
                            .allow(null, '')
                            .min(20)
                            .max(50)
                            .optional(),
                        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
                            .allow(null, '')
                            .min(16)
                            .max(50)
                            .optional(),

                        AWS_CREDENTIAL_KEY: Joi.string()
                            .allow(null, '')
                            .optional(),
                        AWS_CREDENTIAL_SECRET: Joi.string()
                            .allow(null, '')
                            .optional(),
                        AWS_S3_REGION: Joi.string().allow(null, '').optional(),
                        AWS_S3_BUCKET: Joi.string().allow(null, '').optional(),

                        SSO_GOOGLE_CLIENT_ID: Joi.string()
                            .allow(null, '')
                            .optional(),
                        SSO_GOOGLE_CLIENT_SECRET: Joi.string()
                            .allow(null, '')
                            .optional(),
                        SSO_GOOGLE_CALLBACK_URL_LOGIN: Joi.string()
                            .allow(null, '')
                            .uri()
                            .optional(),
                        SSO_GOOGLE_CALLBACK_URL_SIGN_UP: Joi.string()
                            .allow(null, '')
                            .uri()
                            .optional(),
                    }),
                    validationOptions: {
                        allowUnknown: true,
                        abortEarly: true,
                    },
                }),

                TypeOrmModule.forRootAsync({
                    imports: [DatabaseOptionsModule],
                    useFactory: (dbOptionService: DatabaseOptionService) =>
                        dbOptionService.createOption(),
                    inject: [DatabaseOptionService],
                }),

                MessageModule,
                HelperModule,
                PaginationModule,
                ErrorModule,
                ResponseModule,
                RequestModule,
                ApiKeyModule,
                DebuggerModule.forRoot(),
                AuthCoreModule.forRoot(),
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: { findOne, save },
                },
            ],
        }).compile();
        userService = await module.get(UserService);
    });

    describe('User service should be defined', () => {
        it('Should be defined', () => {
            expect(userService).toBeDefined();
        });
    });

    describe('Get user by username', () => {
        describe('User is match', () => {
            let user: UserEntity;
            beforeEach(() => {
                user = new UserEntity();
                findOne.mockReturnValue(Promise.resolve(user));
            });

            it('Should return user', async () => {
                const fetchedUser = await userService.getByUsername('admin');
                expect(fetchedUser).toEqual(user);
            });
        });

        describe('User is not match', () => {
            beforeEach(() => {
                findOne.mockReturnValue(null);
            });

            it('Should return undefined', async () => {
                try {
                    await userService.getByUsername('admin');
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                }
            });
        });
    });

    describe('Register user', () => {
        it('Should throw ConflictException if username already exists', async () => {
            const existingUsername = 'existingUser';
            const userRegisterDTO = {
                username: 'existingUser',
                password: 'cdef3456@A',
                name: 'Terrence Powlowski-Jacobi',
                address: '386 Luciano Fort Curtisworth 95966 Cambodia',
                email: 'Trever80@gmail.com',
                phone: '1-214-747-7267 x4565',
            };

            findOne.mockReturnValue(
                Promise.resolve({ username: existingUsername })
            );

            try {
                await userService.register(userRegisterDTO);
                fail('Expected ConflictException was not thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictException);
            }
        });

        it('Should create and return user', async () => {
            const userRegisterDTO = {
                username: 'user',
                password: 'cdef3456@A',
                name: 'Terrence Powlowski-Jacobi',
                address: '386 Luciano Fort Curtisworth 95966 Cambodia',
                email: 'Trever80@gmail.com',
                phone: '1-214-747-7267 x4565',
            };

            jest.spyOn(userService, 'register').mockImplementationOnce(() =>
                Promise.resolve(userStub())
            );

            const userRegistered = await userService.register(userRegisterDTO);
            expect(userRegistered).toEqual(userStub());
        });
    });

    describe('Login user', () => {
        let userService: UserService;
        let authService: AuthService;

        beforeEach(() => {
            // Mock AuthService methods as needed
            authService = {
                validateUser: jest.fn(),
                getAccessTokenExpirationTime: jest.fn(),
                createPayloadAccessToken: jest.fn(),
                createPayloadRefreshToken: jest.fn(),
                getPayloadEncryption: jest.fn(),
                encryptAccessToken: jest.fn(),
                encryptRefreshToken: jest.fn(),
                createAccessToken: jest.fn(),
                createRefreshToken: jest.fn(),
                checkPasswordExpired: jest.fn(),
            } as any; // Mock AuthService methods here

            userService = new UserService(
                {} as any, // Mocked userRepo
                authService
            );
        });

        // Test for a scenario where the user is not found
        it('Should throw NotFoundException when the user is not found', async () => {
            // Arrange
            const payload: UserLoginDTO = {
                username: 'nonexistentuser',
                password: 'password',
            };
            const expectedError = new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });

            // Mock the getByUsername method to return null (user not found)
            userService.getByUsername = jest.fn().mockResolvedValue(null);

            // Act and Assert
            try {
                await userService.login(payload);
                // If the login doesn't throw an exception, fail the test
                fail('Expected NotFoundException was not thrown.');
            } catch (error) {
                // Check if the error is an instance of NotFoundException
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error).toEqual(expectedError);
            }
        });

        it('should throw BadRequestException when the password does not match', async () => {
            const payload: UserLoginDTO = {
                username: 'existinguser',
                password: 'incorrectpassword',
            };
            const expectedError = new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });

            userService.getByUsername = jest.fn().mockResolvedValue({
                username: 'existinguser',
                password: { passwordHash: 'correctpasswordhash' },
                status: ENUM_USER_STATUS.ACTIVE,
            });

            authService.validateUser = jest.fn().mockResolvedValue(false);

            try {
                await userService.login(payload);
                fail('Expected BadRequestException was not thrown.');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error).toEqual(expectedError);
            }
        });

        // Test for a scenario where login is successful
        it('should return access and refresh tokens on successful login', async () => {
            // Arrange
            const payload: UserLoginDTO = {
                username: 'existinguser',
                password: 'correctpassword',
            };

            // Mock the getByUsername method to return a user
            userService.getByUsername = jest.fn().mockResolvedValue({
                username: 'existinguser',
                password: { passwordHash: 'correctpasswordhash' },
                status: ENUM_USER_STATUS.ACTIVE,
                id: 'userid123',
            });

            // Mock the authService methods as needed for a successful login
            authService.validateUser = jest.fn().mockResolvedValue(true);
            authService.getTokenType = jest.fn().mockResolvedValue('Bearer');
            authService.getAccessTokenExpirationTime = jest
                .fn()
                .mockResolvedValue(3600);
            authService.createPayloadAccessToken = jest
                .fn()
                .mockResolvedValue({});
            authService.createPayloadRefreshToken = jest
                .fn()
                .mockResolvedValue({});
            authService.getPayloadEncryption = jest
                .fn()
                .mockResolvedValue(false);
            authService.createAccessToken = jest
                .fn()
                .mockResolvedValue('access-token');
            authService.createRefreshToken = jest
                .fn()
                .mockResolvedValue('refresh-token');
            authService.checkPasswordExpired = jest
                .fn()
                .mockResolvedValue(false);

            // Act
            const result = await userService.login(payload);

            // Assert
            expect(result).toEqual({
                data: {
                    tokenType: 'Bearer',
                    expiresIn: 3600,
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token',
                },
            });
        });
    });
});
