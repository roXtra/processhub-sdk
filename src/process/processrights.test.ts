import { expect } from "chai";
import {
  isDefaultRole,
  DefaultRoles,
  ProcessAccessRights,
  isProcessOwner,
  isProcessManager,
  canSimulateProcess,
  canStartProcessOld,
  canStartProcess,
  canStartProcessByMail,
  canStartProcessByTimer,
} from "./processrights";
import { IProcessDetails } from "./processinterfaces";
import { createBpmnTemplate } from "./bpmn/bpmnmoddlehelper";
import { ILoadTemplateReply } from "./legacyapi";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { assert } from "console";
import { IUserDetails, Licence } from "../user/userinterfaces";

const testProcess: IProcessDetails = {
  workspaceId: "2000E70281B5ECD5",
  displayName: "Testprocess",
  urlName: "testprocess",
  previewUrl: "https://s3.eu-central-1.amazonaws.com/processhub/2000E70281B5ECD5/8700E70281B5ECD5/preview.svg",
  description: "This is a test process",
  processId: "8700E70281B5ECD5",
  // UserRole gibt für Tests immer volle Rechte, da viele Tests sonst scheitern.
  // Für eine Prüfung des Rechtesystems selbst ist das natürlich nicht geeignet
  userRights: ProcessAccessRights.EditProcess,
  extras: {},
};

const testUser: IUserDetails = {
  licence: Licence.Writer,
  userId: "1",
  mail: "",
  displayName: "",
  extras: {},
  language: "de-DE",
  extendedRights: [],
};

describe("sdk", function () {
  describe("process", function () {
    describe("processrights", function () {
      describe("isDefaultRole", function () {
        it("Follower", function () {
          expect(isDefaultRole(DefaultRoles.Follower)).to.equal(true);
        });

        it("Manager", function () {
          expect(isDefaultRole(DefaultRoles.Manager)).to.equal(true);
        });

        it("Owner", function () {
          expect(isDefaultRole(DefaultRoles.Owner)).to.equal(true);
        });

        it("Viewer", function () {
          expect(isDefaultRole(DefaultRoles.Viewer)).to.equal(true);
        });
      });

      describe("isProcessOwner", function () {
        before(function () {
          testProcess.userRights = ProcessAccessRights.EditProcess;
          testUser.licence = Licence.Writer;
        });

        afterEach(function () {
          testProcess.userRights = ProcessAccessRights.EditProcess;
          testUser.licence = Licence.Writer;
        });

        it("should be owner", function () {
          expect(isProcessOwner(testProcess, testUser)).to.equal(true);
        });

        it("shouldn't be owner because process is null", function () {
          expect(isProcessOwner(undefined, testUser)).to.equal(false);
        });

        it("shouldn't be owner because of insufficient userrights", function () {
          testProcess.userRights = ProcessAccessRights.ManageProcess;
          expect(isProcessOwner(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't be owner because of missing eform edit right", function () {
          testUser.licence = Licence.Reader;
          expect(isProcessOwner(testProcess, testUser)).to.equal(false);
        });
      });

      describe("isProcessManager", function () {
        before(function () {
          testProcess.userRights = ProcessAccessRights.ManageProcess;
          testUser.licence = Licence.Writer;
        });

        afterEach(function () {
          testProcess.userRights = ProcessAccessRights.ManageProcess;
          testUser.licence = Licence.Writer;
        });

        it("should be manager because has the userright", function () {
          expect(isProcessManager(testProcess, testUser)).to.equal(true);
        });

        it("should be manager because is owner", function () {
          testProcess.userRights = ProcessAccessRights.EditProcess;
          expect(isProcessManager(testProcess, testUser)).to.equal(true);
        });

        it("shouldn't be manager because process is null", function () {
          expect(isProcessManager(undefined, testUser)).to.equal(false);
        });

        it("shouldn't be manager because of insufficient userrights", function () {
          testProcess.userRights = ProcessAccessRights.StartProcess;
          expect(isProcessManager(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't be manager because of missing eform edit right", function () {
          testUser.licence = Licence.Reader;
          expect(isProcessManager(testProcess, testUser)).to.equal(false);
        });
      });

      describe("canSimulateProcess", function () {
        before(function () {
          testProcess.isNewProcess = false;
          testUser.licence = Licence.Writer;
        });

        beforeEach(async function () {
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate();
          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);
          testProcess.extras.bpmnProcess = bpmnProcess;
        });

        afterEach(function () {
          testProcess.isNewProcess = false;
          testUser.licence = Licence.Writer;
        });

        it("should simulate", function () {
          expect(canSimulateProcess(testProcess, testUser)).to.equal(true);
        });

        it("shouldn't simulate because process is null", function () {
          expect(canSimulateProcess(undefined, testUser)).to.equal(false);
        });

        it("shouldn't simulate because bpmnProcess is null", function () {
          testProcess.extras.bpmnProcess = undefined;
          expect(canSimulateProcess(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't simulate because process is new", function () {
          testProcess.isNewProcess = true;
          expect(canSimulateProcess(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't simulate because of missing eform edit right", function () {
          testUser.licence = Licence.Reader;
          expect(canSimulateProcess(testProcess, testUser)).to.equal(false);
        });
      });

      describe("canStartProcess", function () {
        before(function () {
          testProcess.userRights = ProcessAccessRights.StartProcess;
          testUser.licence = Licence.Writer;
        });

        beforeEach(async function () {
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate();
          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);
          testProcess.extras.bpmnProcess = bpmnProcess;
          testProcess.userStartEvents = bpmnProcess.getStartButtonMap();
        });

        afterEach(function () {
          testProcess.userRights = ProcessAccessRights.StartProcess;
          testUser.licence = Licence.Writer;
        });

        it("should start", function () {
          assert(testProcess.extras.bpmnProcess != null);
          if (testProcess.extras.bpmnProcess) {
            const start = testProcess.extras.bpmnProcess.getStartEvents(testProcess.extras.bpmnProcess.processId());
            expect(canStartProcess(testProcess, start[0].id, testUser)).to.equal(true);
          }
        });

        it("shouldn't start because process is null", function () {
          assert(testProcess.extras.bpmnProcess != null);
          if (testProcess.extras.bpmnProcess) {
            const start = testProcess.extras.bpmnProcess.getStartEvents(testProcess.extras.bpmnProcess.processId());
            expect(canStartProcess(undefined, start[0].id, testUser)).to.equal(false);
          }
        });

        it("shouldn't start because startEvent is null", function () {
          expect(canStartProcess(testProcess, undefined, testUser)).to.equal(false);
        });

        it("shouldn't start because startEvent is not in map", function () {
          expect(canStartProcess(testProcess, "ABC", testUser)).to.equal(false);
        });

        it("should start without eform edit right", function () {
          testUser.licence = Licence.Reader;
          assert(testProcess.extras.bpmnProcess != null);
          if (testProcess.extras.bpmnProcess) {
            const start = testProcess.extras.bpmnProcess.getStartEvents(testProcess.extras.bpmnProcess.processId());
            expect(canStartProcess(testProcess, start[0].id, testUser)).to.equal(true);
          }
        });
      });

      describe("canStartProcessOld", function () {
        before(function () {
          testProcess.userRights = ProcessAccessRights.StartProcess;
          testUser.licence = Licence.Writer;
        });

        afterEach(function () {
          testProcess.userRights = ProcessAccessRights.StartProcess;
          testUser.licence = Licence.Writer;
        });

        it("should start old", function () {
          expect(canStartProcessOld(testProcess, testUser)).to.equal(true);
        });

        it("shouldn't start old because process is null", function () {
          expect(canStartProcessOld(undefined, testUser)).to.equal(false);
        });

        it("shouldn't start because of insufficient userrights", function () {
          testProcess.userRights = ProcessAccessRights.ViewProcess;
          expect(canStartProcessOld(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't be owner because of missing eform edit right", function () {
          testUser.licence = Licence.Reader;
          expect(canStartProcessOld(testProcess, testUser)).to.equal(false);
        });
      });

      describe("canStartProcessByMail", function () {
        before(function () {
          testProcess.userRights = ProcessAccessRights.StartProcessByMail;
          testUser.licence = Licence.Writer;
        });

        afterEach(function () {
          testProcess.userRights = ProcessAccessRights.StartProcessByMail;
          testUser.licence = Licence.Writer;
        });

        it("should start by mail", function () {
          expect(canStartProcessByMail(testProcess, testUser)).to.equal(true);
        });

        it("shouldn't start by mail because process is null", function () {
          expect(canStartProcessByMail(undefined, testUser)).to.equal(false);
        });

        it("shouldn't start by mail because of insufficient userrights", function () {
          testProcess.userRights = ProcessAccessRights.StartProcessByTimer;
          expect(canStartProcessByMail(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't start by mail because of missing eform edit right", function () {
          testUser.licence = Licence.Reader;
          expect(canStartProcessByMail(testProcess, testUser)).to.equal(false);
        });
      });

      describe("canStartProcessByTimer", function () {
        before(function () {
          testProcess.userRights = ProcessAccessRights.StartProcessByTimer;
          testUser.licence = Licence.Writer;
        });

        afterEach(function () {
          testProcess.userRights = ProcessAccessRights.StartProcessByTimer;
          testUser.licence = Licence.Writer;
        });

        it("should start by timer", function () {
          expect(canStartProcessByTimer(testProcess, testUser)).to.equal(true);
        });

        it("shouldn't start by timer because process is null", function () {
          expect(canStartProcessByTimer(undefined, testUser)).to.equal(false);
        });

        it("shouldn't start by timer because of insufficient userrights", function () {
          testProcess.userRights = ProcessAccessRights.StartProcessByMail;
          expect(canStartProcessByTimer(testProcess, testUser)).to.equal(false);
        });

        it("shouldn't start by timer because of missing eform edit right", function () {
          testUser.licence = Licence.Reader;
          expect(canStartProcessByTimer(testProcess, testUser)).to.equal(false);
        });
      });
    });
  });
});
