import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Setting {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  value: string;
}
