import { BadRequestException, Body, Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtAuthGuard } from "src/guards/jwt-auth.guard"
import useAuth from "src/handlers/useAuth"
import { UserModel } from "src/models/user.model"
import { AuthService } from "src/services/auth.service"
import { AnyFilesInterceptor } from "@nestjs/platform-express"
import master from "src/prompts/master"
import { GoogleGenAI } from '@google/genai'
import { fileToGenerativePart } from "src/handlers/functions"

type AnalysisBody = {
    front: string
    leftside: string
    rightside: string
    name: string
    age: string
    occupation: string
}

@UseGuards(JwtAuthGuard)
@Controller('/analysis')
export class AnalysisController {
    constructor (
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly userModel: UserModel
    ) {}

    @Post('/')
    @UseInterceptors(AnyFilesInterceptor())
    async analyze (@Req() req, @UploadedFiles() files: Array<Express.Multer.File>, @Body() body: AnalysisBody) {
        try {
            const user = await useAuth(req, this.userModel)

            let frontFile = files.find(file => file.fieldname === 'front')
            let leftsideFile = files.find(file => file.fieldname === 'leftside')
            let rightsideFile = files.find(file => file.fieldname === 'rightside')

            if (!frontFile || !leftsideFile || !rightsideFile) {
                throw new BadRequestException('Arquivos inválidos')
            }

            let prompt = master.replace('[NOME DO PACIENTE]', body.name)
            prompt = prompt.replace('[IDADE]', body.age)
            prompt = prompt.replace('[PROFISSÃO]', body.occupation)
            prompt = prompt.replace('[GRATUITO / ESSENCIAL / CLÍNICO / PREMIUM]', 'PREMIUM')

            const ai = new GoogleGenAI({ apiKey: this.configService.get('GEMINI_API_KEY') })
            const model = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    data: frontFile.buffer.toString('base64'),
                                    mimeType: frontFile.mimetype,
                                }
                            },
                            
                            {
                                inlineData: {
                                    data: leftsideFile.buffer.toString('base64'),
                                    mimeType: leftsideFile.mimetype,
                                }
                            },

                            {
                                inlineData: {
                                    data: rightsideFile.buffer.toString('base64'),
                                    mimeType: rightsideFile.mimetype,
                                }
                            }
                        ]
                    }
                ]
            })

            return {
                result: model.text
            };
        } catch (error) {
            console.error(error)
            throw new BadRequestException('Erro ao analisar a íris')
        }
    }
}