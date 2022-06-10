interface ArrRegexExecFileConstruct {
  'js'? : RegExp,
  'njk'? : RegExp,
}

interface ArrIndexOfFileItemConstruct {
  [key:string]: string,
}

interface ArrIndexOfFileConstruct {
  'block': ArrIndexOfFileItemConstruct,
}

interface arrExtensionFileConstruct {
  [key:string]: string,
}

interface ArrIndexFilePathConstruct {
  [key:string]: string,
}

interface ArrDependentFileConstruct {
  [key:string]: Array<string>,
}

interface ArrMainFileConstruct {
  [key:string]: Array<string>,
}

interface ArrFileInfoConstruct {
  'folder-name': string,
  'path'?: string,
  'file-name': string,
  'content'?: any,
  'is-scan-error'?: boolean,
  'is-error'?: boolean,
  'main'?: boolean
}

const ARR_EXTENSION_FILE: arrExtensionFileConstruct = {
  'JS_EXTENSION': 'js',
  'NJK_EXTENSION': 'njk',
};

const ARR_REGEX_EXEC_FILE: ArrRegexExecFileConstruct = {
  [ARR_EXTENSION_FILE.JS_EXTENSION]: /import(?:["'\s]*[\w*${}\n\r\t, ]+from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$|import\(["|'](.*?)['|"]+\)/mg,
  [ARR_EXTENSION_FILE.NJK_EXTENSION]: /{%(?:.*)[extends|include|import]["'\s](?:.*)["'\s](.*[@\w_-]+)["'].*%}/mg,
};

const ARR_INDEX_OF_FILE: ArrIndexOfFileConstruct = {
  'block': {
    'header': '{% block header %}',
    'footer': '{% block footer %}',
  }
};

class Dependents {
  private _strFileExtension: string;
  private _arrIndexFilePath: ArrIndexFilePathConstruct = {};
  private _arrMainFiles: ArrMainFileConstruct = {};
  private _arrHeaderExceptionMainFiles: Array<string>; // NOTE chứa những index file ngoại lệ không cần built lại khi thay đổi header của layout trong nunjucks
  private _arrFooterExceptionMainFiles: Array<string>; // NOTE chứa những index file ngoại lệ không cần built lại khi thay đổi footer của layout trong nunjucks
  private _arrDependentFiles: ArrDependentFileConstruct = {};
  private _regexExecFileContent: RegExp;

  private _arrCommonFileName: Array<string> = [
    'router',
    'store',
    'page-module',
    'app.vue',
    'app',
    'vendor',
    'lib-manager',
  ]; // NOTE - Chứa những tên file được quy định đặt giống nhau theo 1 tiêu chuẩn trên các project / page khác nhau

  // NOTE - use for debug full dependent file graph after finish
  private _awaitGraphDebug: any = null;

  // NOTE - Chứa files dependent đã được kiểm tra trong quá trình truy main file.
  private _arrDependentFileHandled = [];

  isFirstCompile: boolean = true;

  constructor(strFileExtension: string) {
    this._strFileExtension = strFileExtension;
    this._regexExecFileContent = ARR_REGEX_EXEC_FILE[strFileExtension];

    if(this._strFileExtension === ARR_EXTENSION_FILE.NJK_EXTENSION) {
      // NOTE khởi tạo mảng exception header, footer khi định nghĩa NjkDependent
      this._arrHeaderExceptionMainFiles = [];
      this._arrFooterExceptionMainFiles = [];
    }
  }

  generate(arrFileInfo: ArrFileInfoConstruct) {
    if(this._strFileExtension === ARR_EXTENSION_FILE.JS_EXTENSION) {
      return this._generateJsDependent(arrFileInfo);
    } else if(this._strFileExtension === ARR_EXTENSION_FILE.NJK_EXTENSION) {
      return this._generateNjkDenpendent(arrFileInfo);
    }
  };

  private _generateJsDependent(arrJsFileInfo: ArrFileInfoConstruct) {
    // console.log(this._arrDependentFiles);
    const self = this;
    // NOTE Nếu là index file thì thay bằng tên folder của file index đó
    let strTmpFileName = null;

    strTmpFileName = self._generateJsDPKeyOfFileName(
      arrJsFileInfo['file-name'],
      arrJsFileInfo.path
    );

    // NOTE Nếu có filepath kèm theo thì đó là những main file, nên kiểm tra là đã được nạp path hay chưa để nạp, nếu nạp rồi thì return ngay
    if(
      arrJsFileInfo.main &&
      !self._arrIndexFilePath[strTmpFileName]
    ) {
      self._arrIndexFilePath[strTmpFileName] = arrJsFileInfo.path;
    }

    let arrMatchResult = null;
    let arrTmpCurMainFile = [];

    arrJsFileInfo.content = arrJsFileInfo.content.toString().replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/mg, '');

    while((arrMatchResult = self._regexExecFileContent.exec(arrJsFileInfo.content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if(arrMatchResult.index === self._regexExecFileContent.lastIndex) {
        self._regexExecFileContent.lastIndex++;
      }

      const arrFilePathSplit = (arrMatchResult[1] || arrMatchResult[2]).split('/');

      // NOTE Thường là những libraries hoặc plugins, nên sẽ không cần lưu lại, vì những libraries hoặc plugins sẽ ít khi thay đổi
      if(arrFilePathSplit.length <= 1) {
        continue;
      }

      const arrFilePathSlice = arrFilePathSplit.slice(-3);
      let strDependentFileName = arrFilePathSlice[arrFilePathSlice.length - 1];

      const strDependentFolderName = (
        arrFilePathSlice[0] !== strDependentFileName ?
          arrFilePathSlice[0] : null
      );

      strDependentFileName = self._generateJsDPKeyOfFileName(
        strDependentFileName,
        arrJsFileInfo.path,
        {
          path_splitted: arrFilePathSlice,
          first_sliced_path: strDependentFolderName
        }
      );

      if(strDependentFileName.indexOf('.vue') === -1) {
        strDependentFileName = strDependentFileName + '.' + ARR_EXTENSION_FILE.JS_EXTENSION;
      }

      if(arrTmpCurMainFile.indexOf(strDependentFileName) === -1) {
        arrTmpCurMainFile.push(strDependentFileName);
      }

      if(!self._arrMainFiles[strTmpFileName]) {
        self._arrMainFiles[strTmpFileName] = [];
      }

      if(self._arrMainFiles[strTmpFileName].indexOf(strDependentFileName) === -1) {
        self._arrMainFiles[strTmpFileName].push(strDependentFileName);
      }

      if(!self._arrDependentFiles[strDependentFileName]) {
        self._arrDependentFiles[strDependentFileName] = [];
      }

      if(self._arrDependentFiles[strDependentFileName].indexOf(strTmpFileName) === -1) {
        self._arrDependentFiles[strDependentFileName].push(strTmpFileName);
      }
    }

    if(
      self._arrMainFiles[strTmpFileName] &&
      self._arrMainFiles[strTmpFileName].length > 0
    ) {
      const arrCompareFile = self._comparerArray(self._arrMainFiles[strTmpFileName], arrTmpCurMainFile);

      if(arrCompareFile.length > 0) {
        // NOTE Update lại array gốc của main file hiện tại
        self._arrMainFiles[strTmpFileName] = arrTmpCurMainFile;

        arrCompareFile.forEach(function(strCompareFileName) {
          const arrDependentWithCompareFileName = self._arrDependentFiles[strCompareFileName];
          const indexOfMainFile = arrDependentWithCompareFileName.indexOf(strTmpFileName);

          // NOTE Loại bỏ dependent file đã comment hoặc remove trong main file
          self._arrDependentFiles[strCompareFileName].splice(indexOfMainFile, 1);
        });
      }
    }

    if(self._arrIndexFilePath[strTmpFileName]) {
      return [self._arrIndexFilePath[strTmpFileName]];
    } else if(self._arrDependentFiles[strTmpFileName]) {
      if(self.isFirstCompile) {
        return [];
      }

      const arrMainFileChanged = self._generateMainFileList(self._arrDependentFiles[strTmpFileName]);

      return arrMainFileChanged;
    }

    // NOTE - Debug graph dependent util for js files
    // if(self._awaitGraphDebug) {
    //   clearTimeout(self._awaitGraphDebug);
    //   self._awaitGraphDebug = null;
    // }

    // self._awaitGraphDebug = setTimeout(function() {
    //   console.log(self._arrDependentFiles);
    // }, 100);

    return [];
  }

  private _generateNjkDenpendent(arrNjkFileInfo: ArrFileInfoConstruct) {
    const self = this;
    // NOTE Nếu là index file thì thay bằng tên folder của file index đó
    let strTmpFileName = null;
    // NOTE replace tất cả những comment trong content file trước khi convert
    arrNjkFileInfo.content = arrNjkFileInfo.content.toString().replace(/{#[^>]*#}/mg, '');

    if(arrNjkFileInfo['file-name'] === 'index.njk') {
      // NOTE Nếu file name là index thì thay bằng folder-name
      strTmpFileName = arrNjkFileInfo['folder-name'] + '.' + ARR_EXTENSION_FILE.NJK_EXTENSION;

      if(
        arrNjkFileInfo.content.indexOf(ARR_INDEX_OF_FILE.block.header) !== -1 &&
        self._arrHeaderExceptionMainFiles.indexOf(strTmpFileName) === -1
      ) {
        self._arrHeaderExceptionMainFiles.push(strTmpFileName);
      } else if(
        arrNjkFileInfo.content.indexOf(ARR_INDEX_OF_FILE.block.header) === -1 &&
        self._arrHeaderExceptionMainFiles.indexOf(strTmpFileName) !== -1
      ) {
        const indexOfHeaderExceptionMainFiles = self._arrHeaderExceptionMainFiles.indexOf(strTmpFileName);

        self._arrHeaderExceptionMainFiles.splice(indexOfHeaderExceptionMainFiles, 1);
      }

      if(
        arrNjkFileInfo.content.indexOf(ARR_INDEX_OF_FILE.block.footer) !== -1 &&
        self._arrFooterExceptionMainFiles.indexOf(strTmpFileName) === -1
      ) {
        self._arrFooterExceptionMainFiles.push(strTmpFileName);
      } else if(
        arrNjkFileInfo.content.indexOf(ARR_INDEX_OF_FILE.block.footer) === -1 &&
        self._arrFooterExceptionMainFiles.indexOf(strTmpFileName) !== -1
      ) {
        const indexOfFooterExceptionMainFiles = self._arrFooterExceptionMainFiles.indexOf(strTmpFileName);

        self._arrFooterExceptionMainFiles.splice(indexOfFooterExceptionMainFiles, 1);
      }
    } else {
      // NOTE Nếu file name không phải là index thì giữ nguyên file name
      strTmpFileName = arrNjkFileInfo['file-name'];
    }

    // NOTE Nếu có filepath kèm theo thì đó là những main file, nên kiểm tra là đã được nạp path hay chưa để nạp, nếu nạp rồi thì return ngay
    if(arrNjkFileInfo.path) {
      if(!self._arrIndexFilePath[strTmpFileName]) {
        self._arrIndexFilePath[strTmpFileName] = arrNjkFileInfo.path;
      }
    }

    let arrMatchResult = null;
    let arrTmpCurMainFile = [];

    while((arrMatchResult = self._regexExecFileContent.exec(arrNjkFileInfo.content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if(arrMatchResult.index === self._regexExecFileContent.lastIndex) {
        self._regexExecFileContent.lastIndex++;
      }

      const arrFilePathSplit = arrMatchResult[1].split('/');

      // NOTE Thường là những libraries hoặc plugins, nên sẽ không cần lưu lại, vì những libraries hoặc plugins sẽ ít khi thay đổi
      if(arrFilePathSplit.length <= 1) {
        continue;
      }

      const strDependentFileName = arrFilePathSplit.slice(-2)[1];

      if(arrTmpCurMainFile.indexOf(strDependentFileName) === -1) {
        arrTmpCurMainFile.push(strDependentFileName);
      }

      if(!self._arrMainFiles[strTmpFileName]) {
        self._arrMainFiles[strTmpFileName] = [];
      }

      if(self._arrMainFiles[strTmpFileName].indexOf(strDependentFileName) === -1) {
        self._arrMainFiles[strTmpFileName].push(strDependentFileName);
      }

      if(!self._arrDependentFiles[strDependentFileName]) {
        self._arrDependentFiles[strDependentFileName] = [];
      }

      if(self._arrDependentFiles[strDependentFileName].indexOf(strTmpFileName) === -1) {
        self._arrDependentFiles[strDependentFileName].push(strTmpFileName);
      }
    }

    if(
      self._arrMainFiles[strTmpFileName] &&
      self._arrMainFiles[strTmpFileName].length > 0
    ) {
      const arrCompareFile = self._comparerArray(self._arrMainFiles[strTmpFileName], arrTmpCurMainFile);

      if(arrCompareFile.length > 0) {
        // NOTE Update lại array gốc của main file hiện tại
        self._arrMainFiles[strTmpFileName] = arrTmpCurMainFile;

        arrCompareFile.forEach(function(strCompareFileName) {
          const arrDependentWithCompareFileName = self._arrDependentFiles[strCompareFileName];
          const indexOfMainFile = arrDependentWithCompareFileName.indexOf(strTmpFileName);

          // NOTE Loại bỏ dependent file đã comment hoặc remove trong main file
          self._arrDependentFiles[strCompareFileName].splice(indexOfMainFile, 1);
        });
      }
    }

    if(self._arrIndexFilePath[strTmpFileName]) {
      return [self._arrIndexFilePath[strTmpFileName]];
    } else if(self._arrDependentFiles[strTmpFileName]) {
      if(self.isFirstCompile) {
        return ;
      }

      let arrCheckOtherCondition = {
        'block': {
          'is-check-condition': false,
          'file-name': null,
        }
      };

      if(
        strTmpFileName === 'header.njk' ||
        strTmpFileName === 'footer.njk'
      ) {
        arrCheckOtherCondition.block['is-check-condition'] = true;
        arrCheckOtherCondition.block['file-name'] = strTmpFileName;
      }

      const arrMainFileChanged = self._generateMainNjkFileList(self._arrDependentFiles[strTmpFileName], arrCheckOtherCondition);

      return arrMainFileChanged;
    }

    return ;
  }

  private _comparerArray(mainArray: Array<string>, otherArray: Array<string> = []) {
    if(
      !otherArray ||
      otherArray.length <= 0
    ) {
      return mainArray;
    }

    return mainArray.filter(function(value){
      return otherArray.indexOf(value) === -1;
    });
  }

  private _unionArray(arrDependentFiles: Array<string>) {
    const arrUnionFactory = arrDependentFiles.filter(function(strDependentFileItem, pos, self) {
      return self.indexOf(strDependentFileItem) == pos;
    });

    return arrUnionFactory;
  }

  removeDependentFiles(strFileName) {
    const self = this;
    const arrMainFiles = self._arrMainFiles[strFileName];
    self._arrMainFiles[strFileName] = [];

    if(
      arrMainFiles &&
      arrMainFiles.length > 0
    ) {
      arrMainFiles.forEach(function(strDependentFileName) {
        const arrDependentFiles = self._arrDependentFiles[strDependentFileName];

        if(
          arrDependentFiles &&
          arrDependentFiles.length > 0
        ) {
          const indexOfMainFile = arrDependentFiles.indexOf(strFileName);

          if(indexOfMainFile !== -1) {
            self._arrDependentFiles[strDependentFileName].splice(indexOfMainFile, 1);
          }
        }
      });
    }
  }

  private _generateMainFileList(
    arrDependentFileCurList: Array<string>,
    arrTmpMainPathResult: Array<string> = [],
    arrTmpDependentCollect: Array<string> = [],
  ) {
    const self = this;

    arrDependentFileCurList.forEach(function(strDepentFileItem) {
      const indexFilePath = self._arrIndexFilePath[strDepentFileItem];
      const hasIndexFilePath = !!indexFilePath;

      if(
        hasIndexFilePath &&
        !arrTmpMainPathResult.includes(indexFilePath)
      ) {
        arrTmpMainPathResult.push(self._arrIndexFilePath[strDepentFileItem]);
      } else if(
        !hasIndexFilePath &&
        !self._arrDependentFileHandled.includes(strDepentFileItem) &&
        self._arrDependentFiles[strDepentFileItem]
      ) {
        if(arrTmpDependentCollect.length <= 0) {
          arrTmpDependentCollect = self._arrDependentFiles[strDepentFileItem];
        } else {
          arrTmpDependentCollect = arrTmpDependentCollect.concat(self._arrDependentFiles[strDepentFileItem]);
        }

        self._arrDependentFileHandled.push(strDepentFileItem);
      }
    });

    if(arrTmpDependentCollect.length <= 0) {
      self._arrDependentFileHandled = [];
      return arrTmpMainPathResult ?? [];
    }

    arrTmpDependentCollect = self._unionArray(arrTmpDependentCollect);

    return self._generateMainFileList(
      arrTmpDependentCollect,
      arrTmpMainPathResult
    );
  }

  private _generateMainNjkFileList(
    arrDependentFileCurList: Array<string>,
    arrCheckOtherCondition,
    arrTmpMainPathResult: Array<string> = [],
    arrTmpDependentCollect: Array<string> = [],
  ) {
    const self = this;

    arrDependentFileCurList.forEach(function(strDepentFileItem) {
      if(
        self._arrIndexFilePath[strDepentFileItem] &&
        arrTmpMainPathResult.indexOf(self._arrIndexFilePath[strDepentFileItem]) === -1
      ) {
        if(arrCheckOtherCondition.block['is-check-condition']) {
          if(
            arrCheckOtherCondition.block['file-name'] === 'header.njk' &&
            self._arrHeaderExceptionMainFiles.indexOf(strDepentFileItem) === -1
          ) {
            arrTmpMainPathResult.push(self._arrIndexFilePath[strDepentFileItem]);
          } else if(
            arrCheckOtherCondition.block['file-name'] === 'footer.njk' &&
            self._arrFooterExceptionMainFiles.indexOf(strDepentFileItem) === -1
          ) {
            arrTmpMainPathResult.push(self._arrIndexFilePath[strDepentFileItem]);
          }
        } else {
          arrTmpMainPathResult.push(self._arrIndexFilePath[strDepentFileItem]);
        }
      } else if(self._arrDependentFiles[strDepentFileItem]) {
        if(arrTmpDependentCollect.length <= 0) {
          arrTmpDependentCollect = self._arrDependentFiles[strDepentFileItem];
        } else {
          arrTmpDependentCollect.concat(self._arrDependentFiles[strDepentFileItem]);
        }
      }
    });

    if(arrTmpDependentCollect.length <= 0) {
      return arrTmpMainPathResult ?? [];
    }

    arrTmpDependentCollect = self._unionArray(arrTmpDependentCollect);

    return self._generateMainNjkFileList(
      arrTmpDependentCollect,
      arrCheckOtherCondition,
      arrTmpMainPathResult
    );
  }

  private _generateJsDPKeyOfFileName(
    fileName: string,
    filePath,
    dependentFileInfo?: {
      path_splitted: Array<string>,
      first_sliced_path: string
    }
  ) {
    const arrFilePathSplitted = filePath.split('/');
    let strLandingDirName = '';
    let strPageDirName = '';

    if(filePath.includes('/landing')) {
      const landingIdx = arrFilePathSplitted.indexOf('landing');
      strLandingDirName = arrFilePathSplitted[landingIdx + 1] + '/';
    }

    // NOTE - If dependent file path doesn't include "global" directory, then is valid
    if(
      dependentFileInfo &&
      dependentFileInfo.path_splitted &&
      !dependentFileInfo.path_splitted.includes('global')
    ) {
      /**
       * NOTE
       * - If dependent file path doesn't include "partial" directory, then get directory at right beside to setup for strPageDirName variable
       * - If dependent file path doesn't include "~jsPartialPath" directory, then get directory at right beside to setup for strPageDirName variable
       * - If dependent file path doesn't include ". | .." relative path and filePath include 'partial', then get directory at right beside filePath 'partial' directory to setup for strPageDirName variable
       */
      strPageDirName = (
        dependentFileInfo.path_splitted.includes('partial') ?
          dependentFileInfo.path_splitted[dependentFileInfo.path_splitted.indexOf('partial') + 1] + '/' :
          dependentFileInfo.path_splitted.includes('~jsPartialPath') ?
            dependentFileInfo.path_splitted[dependentFileInfo.path_splitted.indexOf('~jsPartialPath') + 1] + '/' :
            (
              dependentFileInfo.first_sliced_path &&
              ['.','..'].includes(dependentFileInfo.first_sliced_path)
            ) &&
            filePath.includes('partial') &&
            !filePath.includes('global') ?
            arrFilePathSplitted[arrFilePathSplitted.indexOf('partial') + 1] + '/' : ''
      );
    } else if(
      !dependentFileInfo &&
      filePath.includes('partial') &&
      !filePath.includes('global')
    ) {
      strPageDirName = arrFilePathSplitted[arrFilePathSplitted.indexOf('partial') + 1] + '/';
    }

    return strLandingDirName + strPageDirName + fileName;
  } // _generateKeyOfFileName()
}

export default Dependents;
