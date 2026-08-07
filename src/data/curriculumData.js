import curriculumRaw from '../../curriculum.json';

export const cohortTitle = curriculumRaw.cohort;
export const modulesList = curriculumRaw.modules || [];
export const daysList = curriculumRaw.days || [];

export function getDayByNumber(dayNum) {
  return daysList.find(d => d.day === dayNum);
}

export function getModuleForDay(dayNum) {
  return modulesList.find(m => dayNum >= m.days[0] && dayNum <= m.days[1]);
}
