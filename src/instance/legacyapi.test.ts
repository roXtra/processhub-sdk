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
            switch (Number(reportType)) {
              case RequestedInstanceReportType.PROCESSES_REGULAR: {
                const request: IGenerateReportRequest = {
                  reportType: RequestedInstanceReportType.PROCESSES_REGULAR,
                  draftId: "123",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 1,
                };
                validateIgenerateReportRequest(request);
                break;
              }
              case RequestedInstanceReportType.PROCESSES_STATISTICS: {
                const request: IGenerateReportRequest = {
                  reportType: RequestedInstanceReportType.PROCESSES_STATISTICS,
                  draftId: "123",
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
                validateIgenerateReportRequest(request);
                break;
              }
              case RequestedInstanceReportType.RISKS: {
                const request: IGenerateReportRequest = {
                  reportType: RequestedInstanceReportType.RISKS,
                  draftId: "123",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 3,
                };
                validateIgenerateReportRequest(request);
                break;
              }
              case RequestedInstanceReportType.GENERIC_MODULE: {
                const request: IGenerateReportRequest = {
                  reportType: RequestedInstanceReportType.GENERIC_MODULE,
                  draftId: "123",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 9,
                };
                validateIgenerateReportRequest(request);
                break;
              }
              default:
                expect.fail(`Missing test implementation for RequestedInstanceReportType ${String(reportType)}`);
            }
          }
        });
      });
    });
  });
});
