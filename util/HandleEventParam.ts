export interface CommitInquirerType {
  CommitType: Array<string>;
  CommitScope: Array<string>;
  CommitMessage: string,
  CommitVersion:boolean,
  CommitChangeLog:boolean
}

export function CommitInquiredParam() {
  let CommitType = [
    'feat', 'fix', 'to', 'docs', 'style',
    'refactor', 'perf', 'test', 'chore', 'revert',
    'merge', 'sync',
  ]
  let CommitScope = ['component',
    'view', 'api', 'store',
    'router', 'hook', 'directive', 'util', 'config', 'style',
    'mock', 'test', 'doc', 'type', 'deploy',]

  let res = [
    {
      type: 'list',
      name: 'CommitType',
      pageSize: 20,
      message: '请选择 commit 的 type',
      choices: CommitType,
    },
    {
      type: 'list',
      name: 'CommitScope',
      pageSize: 20,
      message: '请选择 commit 的 Scope',
      choices: CommitScope,
    },
    {
      type: 'input',
      name: 'CommitMessage',
      pageSize: 20,
      message: '请填写 commit 的 message',
    },
    {
      type: 'confirm',
      name: 'CommitVersion',
      default:false,
      message: '是否自增版本号',
    },
    {
      type: 'confirm',
      name: 'CommitChangeLog',
      default:false,
      message: '是否写入或者生成CHANGELOG',
    },
  ]
  return res
}