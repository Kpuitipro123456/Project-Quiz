import * as _ from 'lodash';
import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {ExamQuestionsRepository} from './examQuestion.repository';
import {CreateExamQuestionInput} from './examQuestion.dto';
import {ExamsService} from '../exam/exam.service';

@Injectable()
export class ExamQuestionsService {
  constructor(
    @Inject(forwardRef(() => ExamsService))
    private readonly examsService: ExamsService,
    private readonly examQuestionsRepository: ExamQuestionsRepository,
  ) {}

  async createExamQuestion(createExamQuestionInput: CreateExamQuestionInput, questionId: string) {
    const findExam = await this.examsService.readExam(createExamQuestionInput.examId);
    const findExamQuestion = await this.examQuestionsRepository.findOne({
      examId: createExamQuestionInput.examId,
      questionId,
    });
    if (!findExamQuestion) {
      await this.examQuestionsRepository.create({
        examId: createExamQuestionInput.examId,
        questionId,
      });
      this.examsService.incrementNumberField(findExam.id, 'totalMember', 1);
    }
    return {
      examId: createExamQuestionInput.examId,
      questionId,
      join: true,
    };
  }

  async readExamQuestion(examId: string, questionId: string) {
    return this.examQuestionsRepository.findOne({examId, questionId});
  }

  async readExamQuestions(examId: string) {
    const findExamQuestions = await this.examQuestionsRepository.find({examId});
    return findExamQuestions.map((o) => o.questionId);
  }

  async deleteExamQuestion(examId: string, questionId: string) {
    const findExam = await this.examsService.readExam(examId);
    const deleteExamQuestion = await this.examQuestionsRepository.deleteOne({examId, questionId});
    if (!deleteExamQuestion) {
      return {
        examId,
        questionId,
        join: false,
      };
    }
    this.examsService.incrementNumberField(findExam.id, 'totalMember', -1);
    return {
      examId,
      questionId,
      join: false,
    };
  }

  async deleteExamQuestionByExamId(examId: string) {
    return this.examQuestionsRepository.deleteMany({examId});
  }
}
