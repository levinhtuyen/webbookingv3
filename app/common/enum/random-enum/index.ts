import {
  DEVELOPMENT,
  STAGING,
  PRODUCTION
} from '@common/define/enviroment-define';

class GenerateRandom {
  version: number|string;

  // private _intRandomNumber: number = 1;

  constructor() {
    this._initSetupRandomNumber();

    this.version = this._initSetupRandomNumber();
  }

  updateVersion() {
    this.version = this._initSetupRandomNumber();
  }; // updateVersion()

  private _initSetupRandomNumber() {
    if(
      process.env.NODE_ENV === DEVELOPMENT ||
      process.env.NODE_ENV === STAGING
    ) {
      return this._generateRandomNumber();
    } else if(process.env.NODE_ENV === PRODUCTION) {
      return null;
    }
  }; // _initSetupRandomNumber()

  private _generateRandomNumber() {
    return String(Date.now()).slice(-10);
  }; // _generateRandomNumber()
}

export default GenerateRandom;
