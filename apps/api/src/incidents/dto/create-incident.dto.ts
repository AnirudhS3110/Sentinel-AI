import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  rawLogs: string;
}
