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
// import { ChallengeService } from './challenge.service';
// import { CreateChallengeDto } from './dto/create-challenge.dto';
// import { UpdateChallengeDto } from './dto/update-challenge.dto';
// import { CreateAddMatchDto } from './dto/create-addMatch.dto';
// import { PaginationDto } from 'src/utils/pagination.dto';

// @Controller('api/v1/challenge')
// export class ChallengeController {
//   constructor(private readonly challengeService: ChallengeService) {}

//   @Post()
//   create(@Body() createChallengeDto: CreateChallengeDto) {
//     return this.challengeService.create(createChallengeDto);
//   }

//   @Get()
//   findAll(@Query() paginationDto: PaginationDto) {
//     return this.challengeService.findAll(paginationDto);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.challengeService.findOne(id);
//   }

//   @Get('player/:id')
//   findChallengesByIdPlayer(@Param('id') id: string) {
//     return this.challengeService.findChallengesByIdPlayer(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateChallengeDto: UpdateChallengeDto,
//   ) {
//     return this.challengeService.update(id, updateChallengeDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.challengeService.delete(id);
//   }

//   @Patch(':id/AddMatch')
//   AddMatch(
//     @Param('id') id: string,
//     @Body() createAddMatchDto: CreateAddMatchDto,
//   ) {
//     return this.challengeService.addMatch(id, createAddMatchDto);
//   }
// }
