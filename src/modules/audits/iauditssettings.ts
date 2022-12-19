import { IAuditMetricCategory } from "./iauditmetriccategory";
import { ICustomRating } from "./icustomrating";
import IQuestionCatalog from "./iquestioncatalog";

export default interface IAuditsSettings {
  questionCatalog: IQuestionCatalog;
  customRating: ICustomRating;
  auditMetricCategories: IAuditMetricCategory[];
}
