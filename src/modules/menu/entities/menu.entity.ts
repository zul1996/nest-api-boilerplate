import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  
  @Entity('menus')
  export class MenuEntity {
    @PrimaryColumn()
    code: string; // Ini jadi primary key
  
    @Column()
    name: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column({ default: true })
    enable: boolean;
  
    @Column({ nullable: true })
    icon?: string;
  
    @Column({ nullable: true })
    fePath?: string;
  
    @Column({ nullable: true })
    featureCode?: string;
  
    @Column({ type: 'int', default: 1 })
    menuLevel: number;
  
    @Column({ type: 'int', default: 0 })
    dataOrder: number;
  
    @Column({ nullable: true })
    parentCode?: string;
  
    @ManyToOne(() => MenuEntity, (menu) => menu.children, {
      nullable: true,
      onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'parentCode', referencedColumnName: 'code' })
    parent?: MenuEntity;
  
    @OneToMany(() => MenuEntity, (menu) => menu.parent)
    children?: MenuEntity[];
  }
  