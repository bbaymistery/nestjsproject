import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@new-poster-parlor-api/models';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
	],
	controllers: [],
	providers: [],
	exports: [],
})
export class AuthModule { }
