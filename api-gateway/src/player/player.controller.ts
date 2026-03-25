import {
  Body,
  Controller,
  HttpCode,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseGuard } from 'src/common/guards/supabase.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/common/dtos/current-user.dto';

@Controller('api/v2/player')
export class PlayerController {
  private clientAdminBackend: ClientProxy;

  constructor(clienteProxyRmqModule: ClientproxyRmqService) {
    this.clientAdminBackend =
      clienteProxyRmqModule.getClientProxyRmqAdminBackend();
  }

  @Get()
  findAll() {
    return this.clientAdminBackend.send('findAll-player', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientAdminBackend.send('findOneById-player', id);
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Post()
  create(
    @CurrentUser() user: CurrentUserDto,
    @Body() createPlayerDto: CreatePlayerDto,
  ) {
    return this.clientAdminBackend.emit('create-player', {
      ...createPlayerDto,
      email: user?.email,
    });
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.clientAdminBackend.emit('update-player', {
      id,
      updatePlayerDto,
    });
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientAdminBackend.emit('delete-player', id);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.clientAdminBackend.send('uploadedImage-player', {
      id,
      file,
    });
  }
}
