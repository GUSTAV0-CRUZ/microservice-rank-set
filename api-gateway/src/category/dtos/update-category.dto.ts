import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddEventDto } from './add-event.dto';
import { RemoveEventDto } from './remove-event.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddEventDto)
  addEvents: AddEventDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemoveEventDto)
  removeEvents: RemoveEventDto[];
}
