"""Builds src/data/*.json and public/img from a capture of the live site (store API + WP REST)."""
import json,re,sys,os,shutil,html
from bs4 import BeautifulSoup
SRC=sys.argv[1]; OUT='src/data'; IMG='public/img'
L=lambda f: json.load(open(os.path.join(SRC,f)))
def base(u): return u.rsplit('/',1)[-1]
def split(name):
    name=html.unescape(name).strip()
    m=re.match(r'^(.*?)\s*\(([^()]*[஀-௿][^()]*)\)\s*$',name)
    return (m.group(1).strip(),m.group(2).strip()) if m else (name,'')
def clean(h):
    s=BeautifulSoup(h or '','html.parser')
    for t in s.find_all(True):
        keep={'href'} if t.name=='a' else ({'id'} if t.name in('h2','h3') else set())
        t.attrs={k:v for k,v in t.attrs.items() if k in keep}
        if t.name=='a' and t.get('href'): t['href']=t['href'].replace('https://naadunalam.fastfilings.in','')
    return str(s).strip()
vendor={}
stores=[]
for s in L('stores.json'):
    slug=s['shop_url'].rstrip('/').rsplit('/',1)[-1]
    if not os.path.exists(os.path.join(SRC,'store-%d-products.json'%s['id'])): continue
    ids=[p['id'] for p in L('store-%d-products.json'%s['id'])]
    for i in ids: vendor[i]=slug
    stores.append(dict(id=s['id'],slug=slug,name=s['store_name'],phone=s['phone'],registered=s['registered'][:10],productCount=len(ids)))
used=set()
prods=[]
for p in L('products.json'):
    en,ta=split(p['name'])
    pack=next((a['terms'][0]['name'] for a in p['attributes'] if a['name']=='Pack' and a['terms']),'')
    imgs=[]
    for i in p['images']:
        b=base(i['src']); used.add(b); imgs.append(dict(src='/img/'+b,alt=html.unescape(i.get('alt') or en)))
    price=int(p['prices']['price'])/100
    variants=None
    if p['type']=='variable':
        variants=[dict(id=442,pack='100 g',price=40),dict(id=443,pack='250 g',price=70)]
        pack='100 g'
    prods.append(dict(id=p['id'],slug=p['slug'],name=en,nameTa=ta,sku=p['sku'],price=price,
        regularPrice=int(p['prices']['regular_price'])/100,onSale=p['on_sale'],pack=pack,variants=variants,
        short=BeautifulSoup(p['short_description'],'html.parser').get_text(' ',strip=True),
        descriptionHtml=clean(p['description']),images=imgs,
        categories=[c['slug'] for c in p['categories']],vendor=vendor.get(p['id'],'naadunalam'),
        inStock=p['is_in_stock'],stock=int(re.sub(r'\D','',p['stock_availability']['text']) or 0),
        maxQty=p['add_to_cart'].get('maximum') or 99))
cats=[]
for c in L('categories.json'):
    en,ta=split(c['name']); b=base(c['image']['src']) if c.get('image') else ''
    if b: used.add(b)
    cats.append(dict(id=c['id'],slug=c['slug'],name=en,nameTa=ta,description=html.unescape(c.get('description') or ''),count=c['count'],image='/img/'+b if b else ''))
cats.sort(key=lambda c:-c['count'])
postimg={'red-rice-or-sona-masoori':'red-rice-photo.jpg','ragi-flour-millet-kitchens':'Ragi-Flour.jpg','cooking-country-vegetables':'snake-gourd-match.jpg','whole-spices-ground-at-home':'Sambar-Podi.webp','seasonal-picks-fruit-stalls':'naadu-nalam-store-banner.webp'}
posts=[]
catslugs={c['slug'] for c in cats}
def fixlinks(h):
    # posts link to categories that no longer exist (fresh-fruits, spices...): send those to the shop instead
    def r(m): return 'href="/product-category/%s"'%m.group(1) if m.group(1) in catslugs else 'href="/shop"'
    return re.sub(r'href="/product-category/([^/"]+)/?"',r,h)
for x in L('posts.json'):
    fm=x.get('_embedded',{}).get('wp:featuredmedia',[{}])[0].get('source_url')
    b=base(fm) if fm else postimg.get(x['slug'],'naadu-nalam-store-banner.webp'); used.add(b)
    posts.append(dict(slug=x['slug'],title=html.unescape(x['title']['rendered']),date=x['date'][:10],
        excerpt=BeautifulSoup(x['excerpt']['rendered'],'html.parser').get_text(' ',strip=True),
        contentHtml=fixlinks(clean(x['content']['rendered'])),image='/img/'+b))
pol={}
for pg in L('pages.json'):
    if pg['slug'] in('privacy-policy','refund-policy','shipping-policy','terms'):
        s=BeautifulSoup(pg['content']['rendered'],'html.parser')
        for t in s.find_all(['script','style','svg']): t.decompose()
        blocks=[]
        for t in s.find_all(['h1','h2','h3','p','ul','ol']):
            if t.find_parent(['ul','ol','p']): continue
            if not t.get_text(strip=True): continue
            blocks.append(clean(str(t)))
        pol[pg['slug']]=dict(title=html.unescape(pg['title']['rendered']),html='\n'.join(blocks))
os.makedirs(OUT,exist_ok=True); os.makedirs(IMG,exist_ok=True)
for n,d in dict(products=prods,categories=cats,stores=stores,posts=posts,policies=pol).items():
    json.dump(d,open(f'{OUT}/{n}.json','w'),ensure_ascii=False,indent=1)
extra=['nn-hero-cutout-clean-800.webp','naadu-nalam-store-banner.webp','sona-masoori-rice-fix-scaled.jpg','tulsi-infused-honey-photo.jpg','cold-pressed-sesame-oil-photo.jpg','nn-hero-cutout.webp','13-product-whole-spices.webp','25-product-coconut-oil.webp','20-product-raw-honey.webp']
for b in sorted(used|set(extra)):
    f=os.path.join(SRC,b)
    if os.path.exists(f): shutil.copy(f,os.path.join(IMG,b))
    else: print('missing',b)
print(len(prods),len(cats),len(posts),list(pol),len(os.listdir(IMG)))
