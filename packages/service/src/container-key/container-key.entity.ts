import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum REMOVE_FLAG {
  REMOVE,
  UN_REMOVE,
}
@Entity('container_key')
export class ContainerKey {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'container_key', type: 'varchar', comment: '凭证' })
  containerKey: string

  @Column({ name: 'uid', type: 'int', comment: '关联用户id' })
  uid: number

  @Column({
    name: 'remove_flag',
    type: 'int',
    default: REMOVE_FLAG.UN_REMOVE,
    comment: '标记是否被逻辑删除',
  })
  removeFlag: REMOVE_FLAG
}
