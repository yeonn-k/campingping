'use client';

import { useCallback, useEffect, useState } from 'react';
import Category from '@/components/Category/Category';
import Nav from '@/components/Nav/Nav';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card/Card';

const List = () => {
  return (
    <div>
      {/* <Category onCategorySelected={() => {}} /> */}

      <Nav />
    </div>
  );
};

export default List;
