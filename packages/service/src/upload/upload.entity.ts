import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Unique(['filePath'])
@Entity('oss_file')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', name: 'file_path', comment: '文件路径' })
  filePath: string

  @Column({ type: 'varchar', name: 'file_name', comment: '文件名称' })
  fileName: string

  @Column({
    type: 'int',
    name: 'namespace_id',
    comment: '文件的命名空间关联的id',
  })
  namespaceId: number
}
