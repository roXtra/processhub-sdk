import { expect } from "chai";
import { IGenerateReportRequest, IGenerateReportRequestSchema, RequestedReportType } from "./legacyapi.js";
import { IGenerateWorkspaceReportRequest, IGenerateWorkspaceReportRequestSchema } from "../workspace/legacyapi.js";
import { IGenerateProcessReportRequest, IGenerateProcessReportRequestSchema } from "../process/legacyapi.js";

describe("sdk", function () {
  describe("instance", function () {
    describe("legacyapi", function () {
      describe("IGenerateReportRequest", function () {
        function validateIgenerateReportRequest(request: IGenerateReportRequest | IGenerateWorkspaceReportRequest | IGenerateProcessReportRequest): void {
          if (request.reportType === RequestedReportType.WORKSPACE_AUDIT_TRAIL) expect(IGenerateWorkspaceReportRequestSchema.validate(request).error).equals(undefined);
          else if (request.reportType === RequestedReportType.PROCESS_AUDIT_TRAIL) expect(IGenerateProcessReportRequestSchema.validate(request).error).equals(undefined);
          else expect(IGenerateReportRequestSchema.validate(request).error).equals(undefined);
        }

        it("passes validation for requests of all types of RequestedInstanceReportType", function () {
          for (const reportType in RequestedReportType) {
            if (isNaN(Number(reportType))) {
              continue;
            }
            let reportRequest: IGenerateReportRequest | IGenerateWorkspaceReportRequest | IGenerateProcessReportRequest;

            switch (Number(reportType) as RequestedReportType) {
              case RequestedReportType.PROCESSES_REGULAR:
                reportRequest = {
                  reportType: RequestedReportType.PROCESSES_REGULAR,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 1,
                };
                break;
              case RequestedReportType.PROCESSES_STATISTICS:
                reportRequest = {
                  reportType: RequestedReportType.PROCESSES_STATISTICS,
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
              case RequestedReportType.RISKS:
                reportRequest = {
                  reportType: RequestedReportType.RISKS,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 3,
                };
                break;
              case RequestedReportType.GENERIC_MODULE:
                reportRequest = {
                  reportType: RequestedReportType.GENERIC_MODULE,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 9,
                };
                break;
              case RequestedReportType.AUDIT:
                reportRequest = {
                  reportType: RequestedReportType.AUDIT,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 10,
                };
                break;
              case RequestedReportType.AUDIT_TRAIL:
                reportRequest = {
                  reportType: RequestedReportType.AUDIT_TRAIL,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 1,
                };
                break;
              case RequestedReportType.PROCESS_VIEW:
                reportRequest = {
                  reportType: RequestedReportType.PROCESS_VIEW,
                  draftId: "123",
                  processId: "456",
                  instanceIds: [],
                  resultingFileType: "docx",
                  moduleId: 1,
                };
                break;
              case RequestedReportType.WORKSPACE_AUDIT_TRAIL:
                reportRequest = {
                  reportType: RequestedReportType.WORKSPACE_AUDIT_TRAIL,
                  draftId: "123",
                  resultingFileType: "docx",
                  workspaceId: "1",
                  moduleId: 1,
                };
                break;
              case RequestedReportType.PROCESS_AUDIT_TRAIL:
                reportRequest = {
                  reportType: RequestedReportType.PROCESS_AUDIT_TRAIL,
                  draftId: "123",
                  processId: "456",
                  resultingFileType: "pdf",
                  workspaceId: "789",
                  moduleId: 1,
                };
                break;
              default:
                expect.fail(`Missing test implementation for RequestedInstanceReportType ${String(reportType)}. Please add test case for type ${String(reportType)}`);
            }

            expect(reportRequest, "reportRequest is undefined, this must not happen!").not.to.equal(undefined);
            validateIgenerateReportRequest(reportRequest);
          }
        });
      });
    });
  });
});
