
import File from './File';
import Rar from './Rar';
import Success from './Success';

const iconsMap = {
     'file':File,
 'rar':Rar,
 'success':Success,
}

export type IconType = keyof typeof iconsMap;
export default iconsMap;
    