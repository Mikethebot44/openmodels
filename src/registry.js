"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_TO_MODELS = void 0;
exports.getDefaultModel = getDefaultModel;
exports.TASK_TO_MODELS = {
    'image-classification': [
        'google/vit-base-patch16-224',
        'facebook/convnext-base-224',
        'openai/clip-vit-base-patch32',
    ],
    'text-generation': [
        'microsoft/DialoGPT-medium',
        'meta-llama/Llama-3.1-8B-Instruct',
        'meta-llama/Meta-Llama-3-8B-Instruct',
    ],
    'embedding': [
        'sentence-transformers/all-MiniLM-L6-v2',
    ],
    'audio-transcribe': [
        'openai/whisper-base',
    ],
    'audio-summarize': [
        'facebook/bart-large-cnn',
    ],
    'image-generation': [
        'runwayml/stable-diffusion-v1-5',
    ],
};
function getDefaultModel(task) {
    var models = exports.TASK_TO_MODELS[task];
    if (!models || models.length === 0) {
        throw new Error("No default models configured for task: ".concat(task));
    }
    return models[0];
}
