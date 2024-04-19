import {RequestMethod} from '@nestjs/common';
import {RouteInfo} from '@nestjs/common/interfaces';

export type IndexDirection =
  | 1
  | -1
  | '2d'
  | '2dsphere'
  | 'geoHaystack'
  | 'hashed'
  | 'text'
  | 'ascending'
  | 'asc'
  | 'descending'
  | 'desc';

export type IndexDefinition = Record<string, IndexDirection>;

export enum DbModel {
  Users = 'users',
  Questions = 'questions',
  Categories = 'categories',
  Tags = 'tags',
  Exams = 'exams',
  ExamUsers = 'exam_users',
  ExamQuestions = 'exam_questions',
  QuestionStatistics = 'question_statistics',
  QuestionTags = 'question_tags',
  Answers = 'answers',
  Otps = 'otps',
}

export enum Timezone {
  HoChiMinh = 'Asia/Ho_Chi_Minh',
}

export const API_VERSION = '1.0.0';
export const ACCESS_TOKEN_HEADER_NAME = 'access-token';
export const EXCLUDED_LOGGER_MIDDLEWARE_ROUTES: RouteInfo[] = [
  {path: '/health', method: RequestMethod.GET},
];
export const EXCLUDED_USER_MIDDLEWARE_ROUTES: RouteInfo[] = [
  {path: '/health', method: RequestMethod.GET},
  {path: '/auth/login', method: RequestMethod.POST},
];

export enum UserDataJwtProperties {
  USERID = 'id',
}

export const TOTAL_COUNT_HEADER_NAME = 'x-total-count';
export const NEXT_PAGE_HEADER_NAME = 'x-next-page';
export const PAGE_HEADER_NAME = 'x-page';
export const PAGES_COUNT_HEADER_NAME = 'x-pages-count';
export const PER_PAGE_HEADER_NAME = 'x-per-page';
export const CORS_EXPOSED_HEADERS =
  `${NEXT_PAGE_HEADER_NAME},${PAGE_HEADER_NAME},${PAGES_COUNT_HEADER_NAME},` +
  `${PER_PAGE_HEADER_NAME},${TOTAL_COUNT_HEADER_NAME}`;

export const examples = {
  appName: 'QUIZ-2023',
  accountName: 'example account',
  email: 'example@email.com',
  objectId: '6399f5469f80115a1fb3031c',
  password: 'veryverysecret',
  followerId: '1234ws2a-7496-4ea7-2435-25baef6de933',
  userId: '57b775c2-7496-4ea7-bb7e-25baef6de933',
  userName: 'veryvery',
  name: 'Nguyễn Văn A',
  phoneNumber: '0981248920',
  authToken: 'authToken',
  examName: 'Đề thi đánh giá tư duy ĐHBK HN',
  examSlug: 'de-thi-danh-gia-tu-duy-dhbk-hn',
  groupDescription: 'Nơi luyện đề, chia sẻ kiến thức, ôn thi THPT Quốc gia môn Tiếng Anh 2017',
  groupIntroduction: '',
  title: 'Mua 02 vé xem phim tặng 01 MY COMBO',
  description:
    'Chương trình ưu đãi dành cho chủ thẻ CITI tại CGV "Mua 02 vé xem phim tặng 01 MY COMBO"',
  content:
    'Đến CGV vào thứ tư hàng tuần để tận hưởng những bộ phim cực hay với giá cực ưu đãi các bạn nhé! Không cần chờ đợi đến cuối tuần, hãy đến CGV để nạp lại năng lượng nào!',
  thumbnail: 'https://www.studyphim.vn/system/movies/486/thumbnails/medium/Untitled.png',
  slug: 'mua-02-ve-xem-phim-tang-01-my-combo',
  createdAt: '2022-12-18T15:58:42.812Z',
  videoUrl: 'https://www.youtube.com/watch?v=1i9kcBHX2Nw',
  urlRedirect: 'https://www.quiz.com/confirm-otp',
  filmCategory: 'Phim chiến tranh',
  censor: 'C13 không dành cho khán giả dưới 13 tuổi',
  director: 'Hwang In-Ho',
  actor: 'Trường Giang, Trấn Thành, Xuân Bắc, Tự Long,...',
  language: 'Tiếng Anh - Phụ đề tiếng Việt, tiếng Trung',
  startTime: '2022-12-18T18:30:42.812Z',
  endTime: '2022-12-18T20:00:42.812Z',
  price: 99000,
  active: 'ACTIVE',
  roles: [],
  chairId: '57b775c2-7496-4ea7-bb7e-25baef6de933',
  information: {
    userId: '57b775c2-7496-4ea7-bb7e-25baef6de933',
    userName: 'Harvey',
    bookedAt: '2023-03-20T09:48:59.272Z',
  },
  chairName: 'A09',
  referralCode: 'MAGIOITHIEU06',
  otp: '111111',
  token:
    'toeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTcyYmFhODA3MDZlYzA1YzJhYmUyOSIsInBob25lTnVtYmVyIjoiMDk4MTI0ODkyMCIsIm5hbWUiOiJOZ3V54buFbiBWxINuIEEiLCJwZXJtaXNzaW9ucyI6W10sImltYWdlVXJsIjoiaHR0cHM6Ly93d3cuc3R1ZHlwaGltLnZuL3N5c3RlbS9tb3ZpZXMvNDg2L3RodW1ibmFpbHMvbWVkaXVtL1VudGl0bGVkLnBuZyIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpYXQiOjE2NzkyODgxNDYsImV4cCI6MTY4MDE4ODE0Nn0.aSFiQS-TQYd3i7skJcNBY0Cgk5-ZB3iHCfkv8x7WV-Eken',
  position: 'EXPERT',
  categoryName: 'Đánh giá tư duy',
  categorySlug: 'danh-gia-tu-duy',
  tagName: 'Ngân hàng thương mại',
  tagSlug: 'ngan-hang-thuong-mai',
  fieldName: 'NH Chính sách xã hội',
  fieldSlug: 'nh-chinh-sach-xa-hoi',
  code: 'VN1111',
  countryName: 'Việt Nam',
  countrySlug: 'viet-nam',
  countryCode: 'VN',
  languageCode: 'VI',
  organizationName: 'Đại học Bách khoa Hà Nội',
  organizationSlug: 'dai-hoc-bach-khoa-ha-noi',
  organizationCode: 'HUST',
  positionName: 'Sinh viên',
  positionSlug: 'sinh-vien',
  ageRangeTitle: 'Từ 18 đến 23 tuổi',
  ageRangeMin: 18,
  ageRangeMax: 23,
  questionTitle: 'Kinh tế thị trường định hướng xã hội chủ nghĩa:',
  questionContent:
    'Kinh tế thị trường định hướng Xã hội chủ nghĩa là nền kinh tế vận hành theo cơ chế',
  questionexplanation:
    '[Giải thích] Kinh tế thị trường định hướng Tư bản chủ nghĩa có sự điều tiết của Nhà nước Tư sản',
  questionKey: 1,
  questionPoint: 6,
  questionCode: 'IELTS_Reading_1',
  questionAnswers: [
    {
      answerUid: '6399f5469f80115a1fb3031c',
      content: 'Phân phối theo phúc lợi',
    },
    {
      answerUid: '2349f5469f80115a1fb3031e',
      content: 'Phân phối theo lao động',
    },
    {
      answerUid: '6789f5469f80115a1fb30318',
      content: 'Phân phối theo lao động',
    },
    {
      answerUid: '9809f5469f80115a1fb3031k',
      content: 'Phân phối theo vốn góp',
    },
  ],
  questionAnswersResult: [
    {
      answerUid: '6399f5469f80115a1fb3031c',
      content: 'Phân phối theo phúc lợi',
      isTrue: false,
    },
    {
      answerUid: '2349f5469f80115a1fb3031e',
      content: 'Phân phối theo lao động',
      isTrue: false,
    },
    {
      answerUid: '6789f5469f80115a1fb30318',
      content: 'Phân phối theo lao động',
      isTrue: true,
    },
    {
      answerUid: '9809f5469f80115a1fb3031k',
      content: 'Phân phối theo vốn góp',
      isTrue: false,
    },
  ],
  questionFields: ['9809f5469f80115a1fb3031k', '6789f5469f80115a1fb30318'],
};
