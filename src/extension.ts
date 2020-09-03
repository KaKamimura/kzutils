// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// // Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('kzutils.helloWorld', () => {
		if (!vscode.window.activeTextEditor
			|| !vscode.window.activeTextEditor.document
			|| vscode.window.activeTextEditor.selection.isEmpty) {
			vscode.window.showErrorMessage('桁揃えの対象とする選択範囲を指定してください。');
			return;
		}
		vscode.window.showInputBox({
			prompt: '指定文字列位置で桁揃えを実行します。',
			placeHolder: '桁揃え位置を指定する文字列'
		}).then((searchStr) => {
			if (!searchStr) {
				vscode.window.showErrorMessage('桁位置を指定する文字列を入力してください。');
				return;
			}
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			const doc = editor.document;
			const text = doc.getText(editor.selection);
			let posMax = 0;
			text.split("\n").forEach((line) => {
				const pos = line.indexOf(searchStr);
				if (pos > posMax) {
					posMax = pos;
				}
			});
			if (posMax <= 0) {
				vscode.window.showErrorMessage('指定文字列が見つかりませんでした。');
				return;
			}
			let newText = "";
			text.split("\n").forEach((line) => {
				const pos = line.indexOf(searchStr);
				if (pos >= 0) {
					line = line.substr(0, pos) + " ".repeat(posMax - pos) + line.substr(pos);
				}
				newText += (line + "\n");
			});
			editor.edit(edit => {
				edit.replace(editor.selection, newText);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
