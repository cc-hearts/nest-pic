import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('oss_file')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', name: 'file_path', comment: '文件路径' })
  filePath: string

  @Column({ type: 'varchar', name: 'namespace', comment: '文件的命名空间' })
  namespace: string
}
