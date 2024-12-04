import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'src/configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('mongo.user')}:${configService.get('mongo.password')}@${configService.get('mongo.host')}/${configService.get('mongo.database')}?retryWrites=true&w=majority&appName=NestJsApp`,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// 'mongodb+srv://nestjs_user:admin@cluster0.zeg8wsi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
