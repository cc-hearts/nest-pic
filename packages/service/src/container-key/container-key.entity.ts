import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('container_key')
export class ContainerKey {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'container_key', type: 'varchar', comment: '凭证' })
  containerKey: string

  @Column({ name: 'uid', type: 'int', comment: '关联用户id' })
  uid: number
}
