import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('container_key')
export class ContainerKey {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'container_key', type: 'varchar', comment: '凭证' })
  containerKey: string
}
