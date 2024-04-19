import { IAuditMetricCategory } from "./iauditmetriccategory.js";
import { ICustomRating } from "./icustomrating.js";
import IQuestionCatalog from "./iquestioncatalog.js";

export interface IAuditsSettings {
  questionCatalog: IQuestionCatalog;
  customRating: ICustomRating;
  auditMetricCategories: IAuditMetricCategory[];
}

export default IAuditsSettings;
