import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import { DiagnosticFeature } from 'vscode-languageclient/lib/common/diagnostic';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
    Executable,
    DocumentDiagnosticRequest
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    let serverBinary: string|undefined = workspace.getConfiguration("faerieasm").get("assembler_binary");

    if (serverBinary == undefined || serverBinary == "") {
        throw Error("No server");
    }

    let serverOptions: Executable = {
        command:   serverBinary,
        transport: TransportKind.stdio,
        args:      ["--lsp"]
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'faerieasm' }]
    };

    client = new LanguageClient(
        'faerieasm',
        'Faerie assembly language server',
        serverOptions,
        clientOptions
    );

    client.start();
    let diagnosticReq = client.getFeature(DocumentDiagnosticRequest.method);
    if (diagnosticReq == undefined) {
        throw Error("No diagnostic request feature");
    }
    
    workspace.onDidSaveTextDocument((doc) => {
        let shape = diagnosticReq.getProvider(doc);
    })
}

export function deactivate(): Thenable<void> | undefined {
    if (!client || !client.isRunning()) {
        return undefined;
    }
    return client.stop();
}