// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
// } from '@nestjs/common';
// import { MatchService } from './match.service';
// import { CreateMatchDto } from './dto/create-match.dto';
// import { UpdateMatchDto } from './dto/update-match.dto';
// import { PaginationDto } from 'src/utils/pagination.dto';

// @Controller('api/v1/match')
// export class MatchController {
//   constructor(private readonly matchService: MatchService) {}

//   @Post()
//   create(@Body() createMatchDto: CreateMatchDto) {
//     return this.matchService.create(createMatchDto);
//   }

//   @Get()
//   findAll(@Query() paginationDto: PaginationDto) {
//     return this.matchService.findAll(paginationDto);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.matchService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
//     return this.matchService.update(id, updateMatchDto);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.matchService.delete(id);
//   }
// }
