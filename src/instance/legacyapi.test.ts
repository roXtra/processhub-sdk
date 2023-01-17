import { expect } from "chai";
import { IGenerateReportRequest, IGenerateReportRequestSchema, RequestedInstanceReportType } from "./legacyapi";

describe("sdk", function () {
  describe("instance", function () {
    describe("legacyapi", function () {
      describe("IGenerateReportRequest", function () {
        function validateIgenerateReportRequest(request: IGenerateReportRequest): void {
          expect(IGenerateReportRequestSchema.validate(request).error).is.undefined;
        }

        it("passes validation for requests of all types of RequestedInstanceReportType", function () {
          for (const reportType in RequestedInstanceReportType) {
            if (isNaN(Number(reportType))) {
              continue;
            }
            let reportRequest: IGenerateReportRequest;

            switch (Number(reportType)) {
              case RequestedInstanceReportType.PROCESSES_REGULAR:
                reportRequest = {
                  reportType: RequestedInstanceReportType.PROCESSES_REGULAR,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 1,
                };
                break;
              case RequestedInstanceReportType.PROCESSES_STATISTICS:
                reportRequest = {
                  reportType: RequestedInstanceReportType.PROCESSES_STATISTICS,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 1,
                  statisticsChart: {
                    fromDate: new Date(),
                    toDate: new Date(),
                    image: "",
                    selection: "",
                  },
                };
                break;
              case RequestedInstanceReportType.RISKS:
                reportRequest = {
                  reportType: RequestedInstanceReportType.RISKS,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 3,
                };
                break;
              case RequestedInstanceReportType.GENERIC_MODULE:
                reportRequest = {
                  reportType: RequestedInstanceReportType.GENERIC_MODULE,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 9,
                };
                break;
              case RequestedInstanceReportType.AUDIT:
                reportRequest = {
                  reportType: RequestedInstanceReportType.AUDIT,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 10,
                };
                break;
              default:
                expect.fail(`Missing test implementation for RequestedInstanceReportType ${String(reportType)}. Please add test case for type ${String(reportType)}`);
            }

            expect(reportRequest, "reportRequest is undefined, this must not happen!").to.not.be.undefined;
            validateIgenerateReportRequest(reportRequest);
          }
        });
      });
    });
  });
});
