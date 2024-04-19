import * as _ from 'lodash';
import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {ExamUsersRepository} from './examUser.repository';
import {CreateExamUserInput} from './examUser.dto';
import {ExamsService} from '../exam/exam.service';

@Injectable()
export class ExamUsersService {
  constructor(
    @Inject(forwardRef(() => ExamsService))
    private readonly examsService: ExamsService,
    private readonly examUsersRepository: ExamUsersRepository,
  ) {}

  async createExamUser(createExamUserInput: CreateExamUserInput, userId: string) {
    const findExam = await this.examsService.readExam(createExamUserInput.examId);
    const findExamUser = await this.examUsersRepository.findOne({
      examId: createExamUserInput.examId,
      userId,
    });
    if (!findExamUser) {
      await this.examUsersRepository.create({
        examId: createExamUserInput.examId,
        userId,
      });
      this.examsService.incrementNumberField(findExam.id, 'totalMember', 1);
    }
    return {
      examId: createExamUserInput.examId,
      userId,
      join: true,
    };
  }

  async readExamUser(examId: string, userId: string) {
    const findExamUser = await this.examUsersRepository.findOne({examId, userId});
    return findExamUser
      ? {
          examId,
          userId,
          join: true,
        }
      : {
          examId,
          userId,
          join: false,
        };
  }

  async readExamUsers(examId: string) {
    const findExamUsers = await this.examUsersRepository.find({examId});
    return findExamUsers.map((o) => o.userId);
  }

  async deleteExamUser(examId: string, userId: string) {
    const findExam = await this.examsService.readExam(examId);
    const deleteExamUser = await this.examUsersRepository.deleteOne({examId, userId});
    if (!deleteExamUser) {
      return {
        examId,
        userId,
        join: false,
      };
    }
    this.examsService.incrementNumberField(findExam.id, 'totalMember', -1);
    return {
      examId,
      userId,
      join: false,
    };
  }
}
