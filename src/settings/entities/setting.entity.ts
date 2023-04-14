import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Setting {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  value: string;
}
