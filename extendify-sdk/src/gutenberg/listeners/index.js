import { templateHandler } from './template-inserted'
import { softErrorHandler } from './softerror-encountered'
import { openLibrary } from './open-library'

templateHandler.register()
softErrorHandler.register()
openLibrary.register()
