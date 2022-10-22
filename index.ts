/* eslint-disable */
import { FC, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { withTranslation } from 'react-i18next';
import { i18n } from 'i18next';
import { TFunction } from 'react-i18next';

export interface PageProps<T> {
  page?: T,
  total?: T,
  pageSize?: T
}

interface PaginationProps extends PageProps<number> {
  t: TFunction,
  i18n?: i18n,
  outerCustomClass?: string
  onPageClick?: (val: PageProps<number>) => void
};

const customClass: string = 'cursor-pointer p-2 border w-10 h-10 text-center';

const Pagination: FC<PaginationProps> = (props: PaginationProps) => {
  const { page = 1, total = 0, pageSize = 10, onPageClick, outerCustomClass, t } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const lenPage = Math.ceil(total / pageSize);
  const legPageSet: number[] = useMemo(() =>
    Array.from({ length: lenPage }, (_, ind) => (ind + 1)).
      splice(
        [1, 2, 3].includes(currentPage)
          ? 0
          : (currentPage - 3) >= (lenPage - 5)
          ? lenPage - 5
          : currentPage - 3
      , 5)
  , [currentPage,lenPage]);

  const onPageChange = (_page?: number | '_', operate?: 'Previous' | 'Next') => {
    let curtPage = 0;
    switch(operate) {
      case 'Previous':
        setCurrentPage(prev => {
          const next = prev - 1;
          curtPage = next
          return next;
        });
        break;
      case 'Next':
        setCurrentPage(prev => {
          const next = prev + 1;
          curtPage = next;
          return next;
        });
        break;
      default:
        curtPage = _page as number;
        setCurrentPage(() =>  _page as number);
    }
    onPageClick && onPageClick({ page: curtPage, total, pageSize })
  }

  const onBlurPage = (e: any) => {
    const value = e?.target?.value;
    if (value) {
      setCurrentPage(() => value > lenPage ? lenPage : value);
    }
    if(value) onPageClick && onPageClick({ page: value, total, pageSize })
  }

  return <div className={`flex relative justify-end ${outerCustomClass}`} >
    <FiChevronLeft onClick={() => onPageChange('_', 'Previous')} className={`${customClass} mr-1 ${currentPage === 1 ? 'cursor-not-allow text-gray-300 border-gray-300' : ''}`} />
    {!legPageSet.includes(1) && <div onClick={() => onPageChange(1)} className={`${customClass} mr-1 ${currentPage === 1 ? 'border-themeColor text-themeColor' : ''}`} >1</div>}
    {!(legPageSet.includes(1) || legPageSet.includes(2)) && total !==0 && <div className='px-2 font-extrabold w-10 h-10 text-center leading-8'>
      ...
    </div>}
    {legPageSet.map(page =>
      <div onClick={() => onPageChange(page)} key={page} className={`${customClass} mr-1 ${currentPage === page ? 'border-themeColor text-themeColor' : ''}`}>
        {page}
      </div>
    )}
    {!legPageSet.includes(lenPage) && total !== 0 && <div className='px-2 font-extrabold w-10 h-10 text-center leading-8'>
      ...
    </div>}
    {!legPageSet.includes(lenPage) && total !== 0 && <div onClick={() => onPageChange(lenPage)} className={`${customClass} ml-1`} >
      {lenPage}
    </div>}
    <FiChevronRight onClick={() => onPageChange('_', 'Next')} className={`${customClass} ml-1 ${currentPage === lenPage ? 'cursor-not-allow text-gray-300 border-gray-300' : ''}`} />
    {total ? <div className='px-3 leading-10'>{t('to')}</div> : null}
    {total ? <input type='number' onBlur={onBlurPage} className='px-2 w-16 text-center' /> : null}
    {total ? <div className='px-3 leading-10'>{t('Page')}</div> : null}
  </div>
}

export default withTranslation()(Pagination);
