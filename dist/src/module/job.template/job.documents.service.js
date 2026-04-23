"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDocumentService = void 0;
const index_1 = require("../../models/index");
class JobDocumentService {
    async addDocuments(documentIds, jobId) {
        let documents = [];
        documentIds.forEach((id) => documents.push({ document: id, job: jobId }));
        await index_1.jobDocumentModel.insertMany(documents);
    }
    async deleteDocuments(documentIds) {
        await index_1.jobDocumentModel.deleteMany({ _id: { $in: documentIds } });
    }
}
exports.JobDocumentService = JobDocumentService;
//# sourceMappingURL=job.documents.service.js.map