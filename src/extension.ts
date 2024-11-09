import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
    Executable
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    let serverBinary: string|undefined = workspace.getConfiguration("faerieasm").get("assembler_binary")

    if (serverBinary != undefined) {
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
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client || !client.isRunning()) {
        return undefined;
    }
    return client.stop();
}