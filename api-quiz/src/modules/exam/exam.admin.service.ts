import * as _ from 'lodash';
import {Injectable, NotFoundException} from '@nestjs/common';
import {ExamsRepository} from './exam.repository';
import {CreateExamInput, UpdateExamInput, ExamsFilter} from './exam.dto';
import {generateSlug, filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filtersText} from './exam.constant';
import {ExamsService} from './exam.service';
import {ExamQuestionsService} from '../examQuestion/examQuestion.service';

@Injectable()
export class ExamsAdminService {
  constructor(
    private readonly examsRepository: ExamsRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly examsService: ExamsService,
    private readonly examQuestionsService: ExamQuestionsService,
  ) {}

  async indexExams(examsFilter: ExamsFilter, pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      examsFilter,
      filtersText,
    );
    const sort: Record<any, any> = {priority: -1};

    const [groups, count] = await Promise.all([
      this.examsRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort,
      }),
      this.examsRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: groups,
      headers: responseHeaders,
    };
  }

  async updateExam(examId: string, updateExamInput: UpdateExamInput, userId?: string) {
    await this.examsService.readExam(examId);
    return this.examsRepository.updateById(examId, {
      ...updateExamInput,
      ...(updateExamInput?.name && {slug: generateSlug(updateExamInput.name)}),
      updatedAt: new Date(),
      updatedBy: userId,
    });
  }

  async deleteExam(examId: string) {
    const deleteExam = await this.examsRepository.deleteById(examId);
    if (!deleteExam) {
      throw new NotFoundException('Exam not found');
    }
    await this.examQuestionsService.deleteExamQuestionByExamId(examId);
    return deleteExam;
  }
}
