import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase} from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AppError } from "../../../../shared/errors/AppError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("shoud be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@teste.com.br",
      password: "1234",
      name: "User test",
    }
    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user",  () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@teste.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate an with incorrect password",  () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user2@teste.com",
        password: "1234",
        name: "User test Error",
      }
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate an with incorrect email",  () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user2@teste.com",
        password: "123456",
        name: "User test Error",
      }
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: "wrong email",
        password: user.password
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
