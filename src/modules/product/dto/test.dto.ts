import 'reflect-metadata';
import { FieldMeta } from 'src/common/decorators/field-metada.decorator';

class TestDto {
  @FieldMeta({ label: 'test', order: 0 } as any)
  field1: string;
}

const proto = TestDto.prototype;
const meta = Reflect.getMetadata('field:meta', proto, 'field1');
console.log(meta);
