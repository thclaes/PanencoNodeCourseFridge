import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

@Exclude()
export class LoginBody {
  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  @Length(8)
  public password: string;
}