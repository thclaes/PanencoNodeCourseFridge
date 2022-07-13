import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString, Length } from 'class-validator';

@Exclude()
export class AccessTokenView {
  @Expose()
  @IsString()
  public token: string;

  @Expose()
  @IsNumber()
  public expiresIn: number;
}